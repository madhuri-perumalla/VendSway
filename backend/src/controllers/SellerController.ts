import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import { SellerMatchingService } from '../services/SellerMatchingService';
import { SellerRepository } from '../repositories/SellerRepository';
import prisma from '../config/database';

/**
 * Seller controller
 * Handles HTTP requests for seller discovery and matching
 */
export class SellerController {
  private sellerMatchingService: SellerMatchingService;
  private sellerRepository: SellerRepository;

  constructor(sellerMatchingService: SellerMatchingService, sellerRepository: SellerRepository) {
    this.sellerMatchingService = sellerMatchingService;
    this.sellerRepository = sellerRepository;
  }

  /**
   * Find matching sellers for a catalog gap
   * POST /api/sellers/match
   */
  findMatchingSellers = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, giProductId, limit } = req.body;

    if (!regionId || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'regionId and category are required',
      });
    }

    const matchedSellers = await this.sellerMatchingService.findMatchingSellers(
      regionId,
      category,
      giProductId,
      limit || 10
    );

    return successResponse(
      res,
      {
        regionId,
        category,
        giProductId,
        total: matchedSellers.length,
        matches: matchedSellers,
      },
      'Matching sellers found successfully'
    );
  });

  /**
   * Find sellers for GI product
   * GET /api/sellers/gi/:giProductId
   */
  findSellersForGIProduct = asyncHandler(async (req: Request, res: Response) => {
    const { giProductId } = req.params;
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const sellers = await this.sellerMatchingService.findSellersForGIProduct(
      giProductId,
      limit
    );

    return successResponse(
      res,
      {
        giProductId,
        total: sellers.length,
        matches: sellers,
      },
      'Sellers for GI product found successfully'
    );
  });

  /**
   * Get seller recommendations for a region
   * GET /api/sellers/recommendations/:regionId
   */
  getSellerRecommendations = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const recommendations = await this.sellerMatchingService.getSellerRecommendations(
      regionId,
      limit
    );

    return successResponse(
      res,
      {
        regionId,
        total: recommendations.length,
        recommendations,
      },
      'Seller recommendations retrieved successfully'
    );
  });

  /**
   * Batch match sellers for gaps
   * POST /api/sellers/batch-match
   */
  batchMatchSellersForGaps = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.body;

    if (!regionId) {
      return res.status(400).json({
        status: 'error',
        message: 'regionId is required',
      });
    }

    const results = await this.sellerMatchingService.batchMatchSellersForGaps(regionId);

    return successResponse(
      res,
      {
        regionId,
        totalGaps: results.length,
        matches: results,
      },
      'Batch seller matching completed'
    );
  });

  /**
   * Rank sellers for a specific gap
   * GET /api/sellers/rank/:gapId
   */
  rankSellersForGap = asyncHandler(async (req: Request, res: Response) => {
    const { gapId } = req.params;

    const rankedSellers = await this.sellerMatchingService.rankSellersForGap(gapId);

    return successResponse(
      res,
      {
        gapId,
        total: rankedSellers.length,
        rankedSellers,
      },
      'Sellers ranked successfully'
    );
  });

  /**
   * Get sellers by region
   * GET /api/sellers/region/:regionId
   */
  getSellersByRegion = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const sellers = await this.sellerRepository.getSellersByRegion(regionId);
    return successResponse(res, sellers, 'Sellers retrieved successfully');
  });

  /**
   * Get sellers by category
   * GET /api/sellers/category/:category
   */
  getSellersByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const sellers = await this.sellerRepository.getSellersByCategory(category);
    return successResponse(res, sellers, 'Sellers retrieved successfully');
  });

  /**
   * Search sellers
   * GET /api/sellers/search
   */
  searchSellers = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const sellers = await this.sellerRepository.searchSellers(q);
    return successResponse(res, sellers, 'Search results retrieved successfully');
  });

  /**
   * Get top rated sellers
   * GET /api/sellers/top-rated
   */
  getTopRatedSellers = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const sellers = await this.sellerRepository.getTopRatedSellers(limit);
    return successResponse(res, sellers, 'Top rated sellers retrieved successfully');
  });

  /**
   * Get seller statistics
   * GET /api/sellers/statistics
   */
  getSellerStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const statistics = await this.sellerRepository.getSellerStatistics();
    return successResponse(res, statistics, 'Seller statistics retrieved successfully');
  });

  /**
   * Get seller with products
   * GET /api/sellers/:id
   */
  getSellerWithProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const seller = await this.sellerRepository.getSellerWithProducts(id);

    if (!seller) {
      return res.status(404).json({
        status: 'error',
        message: 'Seller not found',
      });
    }

    return successResponse(res, seller, 'Seller retrieved successfully');
  });

  /**
   * Register a new seller with PENDING status
   * POST /api/sellers/register
   */
  registerSeller = asyncHandler(async (req: Request, res: Response) => {
    const {
      businessName,
      contactPerson,
      email,
      phone,
      location,
      regionId,
      giTagged,
      msme,
      msmeNumber,
      categories,
      productionCapacity,
    } = req.body;

    if (!businessName || !contactPerson || !email || !phone || !location) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: businessName, contactPerson, email, phone, location',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Only accept valid UUID region IDs
    let finalRegionId: string | null = null;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (regionId && uuidPattern.test(regionId)) {
      const regionExists = await prisma.region.findUnique({
        where: { id: regionId },
      });
      if (regionExists) {
        finalRegionId = regionId;
      }
    }

    const sellerData = {
      businessName,
      contactPerson,
      email: normalizedEmail,
      phone,
      location,
      regionId: finalRegionId,
      giTagged: giTagged || false,
      msme: msme || false,
      msmeNumber,
      categories: categories || [],
      productionCapacity: productionCapacity || 0,
      rating: 0,
      status: 'PENDING' as const,
    };

    // Handle re-registration with the same email
    const existingSeller = await prisma.seller.findUnique({
      where: { email: normalizedEmail },
      include: { sellerApplication: true },
    });

    if (existingSeller) {
      if (existingSeller.sellerApplication) {
        return res.status(409).json({
          status: 'error',
          message: 'A seller account with this email already exists. Check the Application Status tab.',
          errorCode: 'DUPLICATE_EMAIL',
          data: {
            sellerId: existingSeller.id,
            applicationId: existingSeller.sellerApplication.id,
            applicationStatus: existingSeller.sellerApplication.status,
          },
        });
      }

      // Recover orphaned seller record (seller exists but application was never created)
      const application = await prisma.sellerApplication.create({
        data: {
          sellerId: existingSeller.id,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });

      return successResponse(
        res,
        { ...existingSeller, sellerApplication: application },
        'Application submitted successfully'
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const seller = await tx.seller.create({ data: sellerData });

      const potentialSeller = await tx.potentialSeller.findFirst({
        where: {
          sellerId: null,
          OR: [{ email: normalizedEmail }, { phone }, { businessName }],
        },
      });

      if (potentialSeller) {
        await tx.potentialSeller.update({
          where: { id: potentialSeller.id },
          data: {
            sellerId: seller.id,
            status: 'REGISTERED',
          },
        });
      }

      const application = await tx.sellerApplication.create({
        data: {
          sellerId: seller.id,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });

      return { seller, application };
    });

    return successResponse(
      res,
      { seller: result.seller, application: result.application },
      'Seller registered successfully'
    );
  });

  /**
   * Get seller application status by email
   * GET /api/sellers/applications/status?email=
   */
  getApplicationByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Email query parameter is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const seller = await prisma.seller.findUnique({
      where: { email: normalizedEmail },
      include: {
        sellerApplication: true,
        region: true,
      },
    });

    if (!seller || !seller.sellerApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'No application found for this email. Please complete registration first.',
      });
    }

    return successResponse(
      res,
      {
        seller,
        application: seller.sellerApplication,
      },
      'Application status retrieved successfully'
    );
  });

  /**
   * Get all seller applications
   * GET /api/sellers/applications
   */
  getSellerApplications = asyncHandler(async (_req: Request, res: Response) => {
    const applications = await prisma.sellerApplication.findMany({
      include: {
        seller: {
          include: {
            region: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return successResponse(res, applications, 'Seller applications retrieved successfully');
  });

  /**
   * Approve a seller application
   * PUT /api/sellers/applications/:id/approve
   */
  approveSellerApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const application = await prisma.sellerApplication.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: 'Admin',
      },
    });

    // Update seller status
    await prisma.seller.update({
      where: { id: application.sellerId },
      data: { status: 'APPROVED' },
    });

    return successResponse(res, application, 'Seller application approved successfully');
  });

  /**
   * Reject a seller application
   * PUT /api/sellers/applications/:id/reject
   */
  rejectSellerApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const application = await prisma.sellerApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: 'Admin',
      },
    });

    // Update seller status
    await prisma.seller.update({
      where: { id: application.sellerId },
      data: { status: 'REJECTED' },
    });

    return successResponse(res, application, 'Seller application rejected successfully');
  });

  /**
   * Withdraw a seller application (seller-initiated)
   * PATCH /api/sellers/:id/withdraw
   */
  withdrawApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Find seller and application
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: { sellerApplication: true },
    });

    if (!seller) {
      return res.status(404).json({
        status: 'error',
        message: 'Seller not found',
      });
    }

    if (!seller.sellerApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'No application found for this seller',
      });
    }

    // Allow withdrawal if status is SUBMITTED or UNDER_REVIEW
    if (seller.sellerApplication.status !== 'UNDER_REVIEW' && seller.sellerApplication.status !== 'SUBMITTED') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot withdraw application with status ${seller.sellerApplication.status}. Only submitted or under-review applications can be withdrawn.`,
      });
    }

    // Update application status to WITHDRAWN
    const updatedApplication = await prisma.sellerApplication.update({
      where: { id: seller.sellerApplication.id },
      data: {
        status: 'WITHDRAWN',
        reviewedAt: new Date(),
        notes: 'Application withdrawn by seller',
      },
    });

    // Update seller with withdrawal timestamp
    const updatedSeller = await prisma.seller.update({
      where: { id },
      data: {
        withdrawnAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return successResponse(
      res,
      { seller: updatedSeller, application: updatedApplication },
      'Application withdrawn successfully'
    );
  });

  /**
   * Deactivate a seller account
   * PATCH /api/sellers/:id/deactivate
   */
  deactivateSellerAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Find seller
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: { sellerApplication: true },
    });

    if (!seller) {
      return res.status(404).json({
        status: 'error',
        message: 'Seller not found',
      });
    }

    // Only allow deactivation if seller is APPROVED
    if (seller.status !== 'APPROVED') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot deactivate seller with status ${seller.status}. Only approved sellers can be deactivated.`,
      });
    }

    // Check if already deactivated
    if (!seller.isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'Seller account is already deactivated',
      });
    }

    // Deactivate seller
    const updatedSeller = await prisma.seller.update({
      where: { id },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return successResponse(
      res,
      updatedSeller,
      'Seller account deactivated successfully'
    );
  });
}
