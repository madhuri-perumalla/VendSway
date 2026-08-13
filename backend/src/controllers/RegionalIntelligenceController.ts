import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import { RegionalIntelligenceService } from '../services/RegionalIntelligenceService';

/**
 * Regional Intelligence controller
 * Handles HTTP requests for regional fashion knowledge
 */
export class RegionalIntelligenceController {
  private regionalIntelligenceService: RegionalIntelligenceService;

  constructor(regionalIntelligenceService: RegionalIntelligenceService) {
    this.regionalIntelligenceService = regionalIntelligenceService;
  }

  /**
   * Get all regions for map display
   * GET /api/intelligence/regions
   */
  getAllRegions = asyncHandler(async (_req: Request, res: Response) => {
    const regions = await this.regionalIntelligenceService.getAllRegions();
    return successResponse(res, regions, 'Regions retrieved successfully');
  });

  /**
   * Get region details with all related data
   * GET /api/intelligence/regions/:id
   */
  getRegionDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const region = await this.regionalIntelligenceService.getRegionDetails(id);
    return successResponse(res, region, 'Region details retrieved successfully');
  });

  /**
   * Get textiles by region
   * GET /api/intelligence/regions/:id/textiles
   */
  getRegionalTextiles = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const textiles = await this.regionalIntelligenceService.getRegionalTextiles(id);
    return successResponse(res, textiles, 'Regional textiles retrieved successfully');
  });

  /**
   * Get festivals by region
   * GET /api/intelligence/regions/:id/festivals
   */
  getRegionalFestivals = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const festivals = await this.regionalIntelligenceService.getRegionalFestivals(id);
    return successResponse(res, festivals, 'Regional festivals retrieved successfully');
  });

  /**
   * Get GI products by region
   * GET /api/intelligence/regions/:id/gi-products
   */
  getRegionalGIProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const giProducts = await this.regionalIntelligenceService.getRegionalGIProducts(id);
    return successResponse(res, giProducts, 'Regional GI products retrieved successfully');
  });

  /**
   * Get regional trends
   * GET /api/intelligence/regions/:id/trends
   */
  getRegionalTrends = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const trends = await this.regionalIntelligenceService.getRegionalTrends(id, limit);
    return successResponse(res, trends, 'Regional trends retrieved successfully');
  });

  /**
   * Search regions by name or code
   * GET /api/intelligence/regions/search
   */
  searchRegions = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return successResponse(res, [], 'Search query required');
    }
    const regions = await this.regionalIntelligenceService.searchRegions(q);
    return successResponse(res, regions, 'Search results retrieved successfully');
  });

  /**
   * Get regional summary for dashboard
   * GET /api/intelligence/regions/:id/summary
   */
  getRegionalSummary = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const summary = await this.regionalIntelligenceService.getRegionalSummary(id);
    return successResponse(res, summary, 'Regional summary retrieved successfully');
  });
}
