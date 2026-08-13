import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, createdResponse } from '../utils/responseFormatter';
import { GapCalculationService } from '../services/GapCalculationService';
import { GapRepository } from '../repositories/GapRepository';
/**
 * Gap controller
 * Handles HTTP requests for catalog gap detection
 */
export class GapController {
  private gapCalculationService: GapCalculationService;
  private gapRepository: GapRepository;

  constructor(gapCalculationService: GapCalculationService, gapRepository: GapRepository) {
    this.gapCalculationService = gapCalculationService;
    this.gapRepository = gapRepository;
  }

  /**
   * Calculate catalog gap for region-category combination
   * POST /api/gaps/calculate
   */
  calculateGap = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, period } = req.body;

    if (!regionId || !category || !period) {
      return res.status(400).json({
        status: 'error',
        message: 'regionId, category, and period are required',
      });
    }

    const gapData = await this.gapCalculationService.calculateCatalogGap(
      regionId,
      category,
      period
    );

    return successResponse(
      res,
      {
        regionId,
        category,
        period,
        ...gapData,
      },
      'Catalog gap calculated successfully'
    );
  });

  /**
   * Calculate and store catalog gap
   * POST /api/gaps/detect
   */
  detectGap = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, period, festivalId } = req.body;

    if (!regionId || !category || !period) {
      return res.status(400).json({
        status: 'error',
        message: 'regionId, category, and period are required',
      });
    }

    const gap = await this.gapCalculationService.calculateAndStoreGap(
      regionId,
      category,
      period,
      festivalId
    );

    return createdResponse(res, gap, 'Catalog gap detected successfully');
  });

  /**
   * Batch calculate gaps for multiple regions and categories
   * POST /api/gaps/batch-detect
   */
  batchDetectGaps = asyncHandler(async (req: Request, res: Response) => {
    const { regionIds, categories, period } = req.body;

    if (!regionIds || !categories || !period) {
      return res.status(400).json({
        status: 'error',
        message: 'regionIds, categories, and period are required',
      });
    }

    if (!Array.isArray(regionIds) || !Array.isArray(categories)) {
      return res.status(400).json({
        status: 'error',
        message: 'regionIds and categories must be arrays',
      });
    }

    const results = await this.gapCalculationService.batchCalculateGaps(
      regionIds,
      categories,
      period
    );

    return successResponse(
      res,
      {
        total: results.length,
        gaps: results,
      },
      'Batch gap detection completed'
    );
  });

  /**
   * Get missing categories for a region
   * GET /api/gaps/missing/:regionId
   */
  getMissingCategories = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const missingCategories = await this.gapCalculationService.getMissingCategories(regionId);
    return successResponse(
      res,
      { regionId, missingCategories },
      'Missing categories retrieved successfully'
    );
  });

  /**
   * Get demand shortage summary for a region
   * GET /api/gaps/shortage/:regionId
   */
  getDemandShortageSummary = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const summary = await this.gapCalculationService.getDemandShortageSummary(regionId);
    return successResponse(res, summary, 'Demand shortage summary retrieved successfully');
  });

  /**
   * Get gap analysis for a region
   * GET /api/gaps/analysis/:regionId
   */
  getGapAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const analysis = await this.gapCalculationService.getGapAnalysis(regionId);
    return successResponse(res, analysis, 'Gap analysis retrieved successfully');
  });

  /**
   * Get gaps by region
   * GET /api/gaps/region/:regionId
   */
  getGapsByRegion = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const gaps = await this.gapRepository.getGapsByRegion(regionId);
    return successResponse(res, gaps, 'Catalog gaps retrieved successfully');
  });

  /**
   * Get gaps by priority
   * GET /api/gaps/priority/:priority
   */
  getGapsByPriority = asyncHandler(async (req: Request, res: Response) => {
    const { priority } = req.params;
    const { regionId } = req.query;
    const gaps = await this.gapRepository.getGapsByPriority(priority, regionId as string);
    return successResponse(res, gaps, 'Gaps by priority retrieved successfully');
  });

  /**
   * Get unresolved gaps
   * GET /api/gaps/unresolved
   */
  getUnresolvedGaps = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.query;
    const gaps = await this.gapRepository.getUnresolvedGaps(regionId as string);
    return successResponse(res, gaps, 'Unresolved gaps retrieved successfully');
  });

  /**
   * Resolve a catalog gap
   * POST /api/gaps/:id/resolve
   */
  resolveGap = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const gap = await this.gapCalculationService.resolveGap(id);
    return successResponse(res, gap, 'Catalog gap resolved successfully');
  });

  /**
   * Get top priority gaps
   * GET /api/gaps/top-priority
   */
  getTopPriorityGaps = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const gaps = await this.gapCalculationService.getTopPriorityGaps(limit);
    return successResponse(res, gaps, 'Top priority gaps retrieved successfully');
  });

  /**
   * Get gaps with filters
   * GET /api/gaps
   */
  getGaps = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, festivalId, priority } = req.query;
    const gaps = await this.gapRepository.getGapsWithFilters({
      regionId: regionId as string,
      category: category as string,
      festivalId: festivalId as string,
      priority: priority as string,
    });
    return successResponse(res, gaps, 'Catalog gaps retrieved successfully');
  });
}
