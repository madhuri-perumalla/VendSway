import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, createdResponse } from '../utils/responseFormatter';
import { DemandCalculationService } from '../services/DemandCalculationService';
import { DemandRepository } from '../repositories/DemandRepository';
/**
 * Demand controller
 * Handles HTTP requests for demand intelligence
 */
export class DemandController {
  private demandCalculationService: DemandCalculationService;
  private demandRepository: DemandRepository;

  constructor(demandCalculationService: DemandCalculationService, demandRepository: DemandRepository) {
    this.demandCalculationService = demandCalculationService;
    this.demandRepository = demandRepository;
  }

  /**
   * Calculate demand score for region-category combination
   * POST /api/demand/calculate
   */
  calculateDemand = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, period } = req.body;

    if (!regionId || !category || !period) {
      return res.status(400).json({
        status: 'error',
        message: 'regionId, category, and period are required',
      });
    }

    const demandScore = await this.demandCalculationService.calculateDemandScore(
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
        demandScore,
      },
      'Demand score calculated successfully'
    );
  });

  /**
   * Calculate and store demand signal
   * POST /api/demand/signal
   */
  createDemandSignal = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, period, source } = req.body;

    if (!regionId || !category || !period) {
      return res.status(400).json({
        status: 'error',
        message: 'regionId, category, and period are required',
      });
    }

    const demandSignal = await this.demandCalculationService.calculateAndStoreDemandSignal(
      regionId,
      category,
      period,
      source
    );

    return createdResponse(res, demandSignal, 'Demand signal created successfully');
  });

  /**
   * Batch calculate demand signals
   * POST /api/demand/batch-calculate
   */
  batchCalculateDemandSignals = asyncHandler(async (req: Request, res: Response) => {
    const { regionIds, categories, period, source } = req.body;

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

    const results = await this.demandCalculationService.batchCalculateDemandSignals(
      regionIds,
      categories,
      period,
      source
    );

    return successResponse(
      res,
      {
        total: results.length,
        signals: results,
      },
      'Batch demand calculation completed'
    );
  });

  /**
   * Get demand analysis for a region
   * GET /api/demand/analysis/:regionId
   */
  getDemandAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const analysis = await this.demandCalculationService.getDemandAnalysis(regionId);
    return successResponse(res, analysis, 'Demand analysis retrieved successfully');
  });

  /**
   * Get demand signals by region
   * GET /api/demand/region/:regionId
   */
  getDemandSignalsByRegion = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const signals = await this.demandRepository.getDemandSignalsByRegion(regionId);
    return successResponse(res, signals, 'Demand signals retrieved successfully');
  });

  /**
   * Get high demand signals
   * GET /api/demand/high-demand
   */
  getHighDemandSignals = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.query;
    const signals = await this.demandRepository.getHighDemandSignals(
      regionId as string
    );
    return successResponse(res, signals, 'High demand signals retrieved successfully');
  });
}
