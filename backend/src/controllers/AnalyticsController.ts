import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import { AnalyticsService } from '../services/AnalyticsService';

/**
 * Analytics controller
 * Handles HTTP requests for dashboard analytics
 */
export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService;
  }

  /**
   * Get demand analytics
   * GET /api/analytics/demand
   */
  getDemandAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, category, startDate, endDate } = req.query;

    const filters: any = {};
    if (regionId) filters.regionId = regionId as string;
    if (category) filters.category = category as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const analytics = await this.analyticsService.getDemandAnalytics(filters);

    return successResponse(res, analytics, 'Demand analytics retrieved successfully');
  });

  /**
   * Get gap analytics
   * GET /api/analytics/gaps
   */
  getGapAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, priority, startDate, endDate } = req.query;

    const filters: any = {};
    if (regionId) filters.regionId = regionId as string;
    if (priority) filters.priority = priority as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const analytics = await this.analyticsService.getGapAnalytics(filters);

    return successResponse(res, analytics, 'Gap analytics retrieved successfully');
  });

  /**
   * Get seller analytics
   * GET /api/analytics/sellers
   */
  getSellerAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { regionId, status, startDate, endDate } = req.query;

    const filters: any = {};
    if (regionId) filters.regionId = regionId as string;
    if (status) filters.status = status as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const analytics = await this.analyticsService.getSellerAnalytics(filters);

    return successResponse(res, analytics, 'Seller analytics retrieved successfully');
  });

  /**
   * Get dashboard overview
   * GET /api/analytics/dashboard
   */
  getDashboardOverview = asyncHandler(async (req: Request, res: Response) => {
    const regionId = req.query.regionId as string;
    const overview = await this.analyticsService.getDashboardOverview(regionId);

    return successResponse(res, overview, 'Dashboard overview retrieved successfully');
  });

  /**
   * Get regional comparison
   * POST /api/analytics/regional-comparison
   */
  getRegionalComparison = asyncHandler(async (req: Request, res: Response) => {
    const { regionIds } = req.body;

    if (!regionIds || !Array.isArray(regionIds)) {
      return res.status(400).json({
        status: 'error',
        message: 'regionIds array is required',
      });
    }

    const comparison = await this.analyticsService.getRegionalComparison(regionIds);

    return successResponse(res, comparison, 'Regional comparison retrieved successfully');
  });

  /**
   * Get unique categories from demand signals
   * GET /api/analytics/categories
   */
  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await this.analyticsService.getUniqueCategories();
    return successResponse(res, categories, 'Categories retrieved successfully');
  });

  /**
   * Get unique festivals
   * GET /api/analytics/festivals
   */
  getFestivals = asyncHandler(async (_req: Request, res: Response) => {
    const festivals = await this.analyticsService.getUniqueFestivals();
    return successResponse(res, festivals, 'Festivals retrieved successfully');
  });
}
