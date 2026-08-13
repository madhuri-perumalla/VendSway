import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, createdResponse } from '../utils/responseFormatter';
import { PotentialSellerService } from '../services/PotentialSellerService';
import { ImportService } from '../services/ImportService';
import { PotentialSellerRepository } from '../repositories/PotentialSellerRepository';
import { ImportHistoryRepository } from '../repositories/ImportHistoryRepository';
import { InvitationRepository } from '../repositories/InvitationRepository';
import { SellerRepository } from '../repositories/SellerRepository';
import { RegionRepository } from '../repositories/RegionRepository';
import prisma from '../config/database';

/**
 * PotentialSeller Controller
 * Handles HTTP requests for potential seller management
 */
export class PotentialSellerController {
  private potentialSellerService: PotentialSellerService;
  private importService: ImportService;

  constructor() {
    const potentialSellerRepository = new PotentialSellerRepository();
    const importHistoryRepository = new ImportHistoryRepository();
    const invitationRepository = new InvitationRepository();
    const sellerRepository = new SellerRepository(prisma);
    const regionRepository = new RegionRepository(prisma);

    this.potentialSellerService = new PotentialSellerService(
      potentialSellerRepository,
      importHistoryRepository,
      invitationRepository,
      sellerRepository
    );

    this.importService = new ImportService(
      potentialSellerRepository,
      importHistoryRepository,
      regionRepository
    );
  }

  /**
   * Get dashboard statistics
   */
  getDashboardStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const statistics = await this.potentialSellerService.getDashboardStatistics();
    successResponse(res, statistics, 'Dashboard statistics retrieved successfully');
  });

  /**
   * Get all potential sellers
   */
  getAllPotentialSellers = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, status, giTagged, msme, source } = req.query;
    const filters: any = {};

    if (regionId) filters.regionId = regionId as string;
    if (status) filters.status = status as string;
    if (giTagged !== undefined) filters.giTagged = giTagged === 'true';
    if (msme !== undefined) filters.msme = msme === 'true';
    if (source) filters.source = source as string;

    const sellers = await this.potentialSellerService.getPotentialSellers(filters);
    successResponse(res, sellers, 'Potential sellers retrieved successfully');
  });

  /**
   * Get potential seller by ID
   */
  getPotentialSellerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const potentialSellerRepository = new PotentialSellerRepository();
    const seller = await potentialSellerRepository.findById(id);

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Potential seller not found' });
    }

    return successResponse(res, seller, 'Potential seller retrieved successfully');
  });

  /**
   * Create potential seller
   */
  createPotentialSeller = asyncHandler(async (req: Request, res: Response) => {
    const seller = await this.potentialSellerService.createPotentialSeller(req.body);
    createdResponse(res, seller, 'Potential seller created successfully');
  });

  /**
   * Update potential seller
   */
  updatePotentialSeller = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const seller = await this.potentialSellerService.updatePotentialSeller(id, req.body);
    successResponse(res, seller, 'Potential seller updated successfully');
  });

  /**
   * Delete potential seller
   */
  deletePotentialSeller = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.potentialSellerService.deletePotentialSeller(id);
    successResponse(res, null, 'Potential seller deleted successfully');
  });

  /**
   * Send invitation to potential seller
   */
  sendInvitation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { method, notes } = req.body;
    const invitation = await this.potentialSellerService.sendInvitation(id, method, notes);
    createdResponse(res, invitation, 'Invitation sent successfully');
  });

  /**
   * Mark potential seller as interested
   */
  markAsInterested = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const seller = await this.potentialSellerService.markAsInterested(id);
    successResponse(res, seller, 'Potential seller marked as interested');
  });

  /**
   * Archive potential seller
   */
  archivePotentialSeller = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const seller = await this.potentialSellerService.archivePotentialSeller(id);
    successResponse(res, seller, 'Potential seller archived successfully');
  });

  /**
   * Search potential sellers
   */
  searchPotentialSellers = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const sellers = await this.potentialSellerService.searchPotentialSellers(q as string);
    successResponse(res, sellers, 'Search results retrieved successfully');
  });

  /**
   * Import potential sellers from file
   */
  importPotentialSellers = asyncHandler(async (req: any, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;
    const fileType = originalname.endsWith('.csv') ? 'csv' : 'excel';
    const importedBy = req.user?.id;

    const result = await this.importService.importFromFile(
      buffer,
      originalname,
      fileType,
      importedBy
    );

    return successResponse(res, result, 'Import completed successfully');
  });

  /**
   * Get import history
   */
  getImportHistory = asyncHandler(async (_req: Request, res: Response) => {
    const history = await this.potentialSellerService.getImportHistory();
    successResponse(res, history, 'Import history retrieved successfully');
  });

  /**
   * Get invitations
   */
  getInvitations = asyncHandler(async (_req: Request, res: Response) => {
    const invitations = await this.potentialSellerService.getInvitations();
    successResponse(res, invitations, 'Invitations retrieved successfully');
  });

  /**
   * Get invitations by potential seller
   */
  getInvitationsByPotentialSeller = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const invitations = await this.potentialSellerService.getInvitationsByPotentialSeller(id);
    successResponse(res, invitations, 'Invitations retrieved successfully');
  });

  /**
   * Get import template
   */
  getImportTemplate = asyncHandler(async (_req: Request, res: Response) => {
    const template = this.importService.getImportTemplate();
    successResponse(res, template, 'Import template retrieved successfully');
  });
}
