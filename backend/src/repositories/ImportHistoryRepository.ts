import prisma from '../config/database';

/**
 * ImportHistory Repository
 * Handles data access for import history tracking
 */
export class ImportHistoryRepository {
  private prisma = prisma;

  constructor() {}

  /**
   * Create import history record
   */
  async create(data: {
    fileName: string;
    importedBy?: string;
    rowsImported: number;
    duplicatesSkipped: number;
    errors?: string;
    errorReport?: string;
  }): Promise<any> {
    return (this.prisma as any).importHistory.create({
      data,
      include: {
        potentialSellers: true,
      },
    });
  }

  /**
   * Get all import history
   */
  async findAll(): Promise<any[]> {
    return (this.prisma as any).importHistory.findMany({
      include: {
        potentialSellers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<any | null> {
    return (this.prisma as any).importHistory.findUnique({
      where: { id },
      include: {
        potentialSellers: true,
      },
    });
  }

  /**
   * Get import statistics
   */
  async getStatistics() {
    const [
      totalImports,
      totalRowsImported,
      totalDuplicatesSkipped,
      recentImports,
    ] = await Promise.all([
      (this.prisma as any).importHistory.count(),
      (this.prisma as any).importHistory.aggregate({
        _sum: { rowsImported: true },
      }),
      (this.prisma as any).importHistory.aggregate({
        _sum: { duplicatesSkipped: true },
      }),
      (this.prisma as any).importHistory.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalImports,
      totalRowsImported: totalRowsImported._sum.rowsImported || 0,
      totalDuplicatesSkipped: totalDuplicatesSkipped._sum.duplicatesSkipped || 0,
      recentImports,
    };
  }
}
