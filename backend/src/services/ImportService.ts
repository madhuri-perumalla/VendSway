import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { PotentialSellerRepository } from '../repositories/PotentialSellerRepository';
import { ImportHistoryRepository } from '../repositories/ImportHistoryRepository';
import { RegionRepository } from '../repositories/RegionRepository';

/**
 * Import Service
 * Handles Excel/CSV import for potential sellers
 */
export class ImportService {
  private potentialSellerRepository: PotentialSellerRepository;
  private importHistoryRepository: ImportHistoryRepository;
  private regionRepository: RegionRepository;

  constructor(
    potentialSellerRepository: PotentialSellerRepository,
    importHistoryRepository: ImportHistoryRepository,
    regionRepository: RegionRepository
  ) {
    this.potentialSellerRepository = potentialSellerRepository;
    this.importHistoryRepository = importHistoryRepository;
    this.regionRepository = regionRepository;
  }

  /**
   * Parse Excel file
   */
  private parseExcel(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  /**
   * Parse CSV file
   */
  private parseCSV(buffer: Buffer): any[] {
    const content = buffer.toString('utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  }

  /**
   * Validate row data
   */
  private validateRow(row: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!row.sellerName || typeof row.sellerName !== 'string' || row.sellerName.trim().length < 2) {
      errors.push('Seller name is required and must be at least 2 characters');
    }

    if (!row.businessName || typeof row.businessName !== 'string' || row.businessName.trim().length < 2) {
      errors.push('Business name is required and must be at least 2 characters');
    }

    if (!row.phone || typeof row.phone !== 'string' || !/^\d{10}$/.test(row.phone.replace(/\D/g, ''))) {
      errors.push('Phone is required and must be a valid 10-digit number');
    }

    if (!row.email || typeof row.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push('Email is required and must be valid');
    }

    if (!row.regionId || typeof row.regionId !== 'string') {
      errors.push('Region ID is required');
    }

    if (!row.categories || !Array.isArray(row.categories) || row.categories.length === 0) {
      errors.push('Categories is required and must be an array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Import potential sellers from file
   */
  async importFromFile(
    file: Buffer,
    fileName: string,
    fileType: 'excel' | 'csv',
    importedBy?: string
  ) {
    let rows: any[];
    let errors: string[] = [];
    let duplicatesSkipped = 0;
    let validRows = 0;
    let invalidRows = 0;

    try {
      // Parse file
      if (fileType === 'excel') {
        rows = this.parseExcel(file);
      } else {
        rows = this.parseCSV(file);
      }

      // Validate and process rows
      const importHistoryId = crypto.randomUUID();
      const processedRows: any[] = [];

      for (const row of rows) {
        // Validate row
        const validation = this.validateRow(row);
        
        if (!validation.valid) {
          invalidRows++;
          errors.push(`Row ${processedRows.length + 1}: ${validation.errors.join(', ')}`);
          continue;
        }

        // Check for duplicates
        const existingByEmail = await this.potentialSellerRepository.findByEmail(row.email);
        const existingByPhone = await this.potentialSellerRepository.findByPhone(row.phone);
        const existingByBusiness = await this.potentialSellerRepository.findByBusinessName(row.businessName);

        if (existingByEmail || existingByPhone || existingByBusiness) {
          duplicatesSkipped++;
          continue;
        }

        // Validate region exists
        const region = await this.regionRepository.findById(row.regionId);
        if (!region) {
          invalidRows++;
          errors.push(`Row ${processedRows.length + 1}: Invalid region ID`);
          continue;
        }

        // Prepare data for import
        processedRows.push({
          ...row,
          status: 'NOT_CONTACTED',
          source: 'Excel Import',
          importHistoryId,
        });
        validRows++;
      }

      // Import valid rows
      const importedSellers = [];
      for (const row of processedRows) {
        try {
          const seller = await this.potentialSellerRepository.create(row);
          importedSellers.push(seller);
        } catch (error) {
          errors.push(`Failed to import seller: ${row.businessName} - ${error}`);
        }
      }

      // Create import history record
      await this.importHistoryRepository.create({
        fileName,
        importedBy,
        rowsImported: importedSellers.length,
        duplicatesSkipped,
        errors: errors.length > 0 ? errors.join('\n') : undefined,
        errorReport: errors.length > 0 ? JSON.stringify(errors, null, 2) : undefined,
      });

      return {
        success: true,
        totalRows: rows.length,
        validRows,
        invalidRows,
        duplicatesSkipped,
        imported: importedSellers.length,
        errors,
      };
    } catch (error) {
      throw new Error(`Import failed: ${error}`);
    }
  }

  /**
   * Get import template
   */
  getImportTemplate() {
    return {
      columns: [
        'sellerName',
        'businessName',
        'phone',
        'email',
        'address',
        'district',
        'state',
        'regionId',
        'categories',
        'specialization',
        'giTagged',
        'giProducts',
        'msme',
        'msmeNumber',
        'description',
        'notes',
      ],
      example: [
        {
          sellerName: 'Rajesh Kumar',
          businessName: 'Kumar Handlooms',
          phone: '9876543210',
          email: 'rajesh.kumar@example.com',
          address: '123 Main Street',
          district: 'Kanchipuram',
          state: 'Tamil Nadu',
          regionId: 'region-uuid-here',
          categories: ['Sarees', 'Handloom'],
          specialization: 'Silk Sarees',
          giTagged: true,
          giProducts: ['Kanchipuram Silk'],
          msme: true,
          msmeNumber: 'UDYAM-TN-01-1234567',
          description: 'Traditional silk saree manufacturer',
          notes: 'Interested in partnership',
        },
      ],
    };
  }
}
