import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import AgentOrchestrator from '../services/aiEngine/AgentOrchestrator';
import CommerceAgentService from '../services/CommerceAgentService';

const commerceAgentService = CommerceAgentService;

export class CommerceAgentController {
  /**
   * Run the Agentic AI agent cycle
   * POST /api/commerce-agent/run
   */
  runAgent = asyncHandler(async (_req: Request, res: Response) => {
    const result = await commerceAgentService.runAgent();

    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return successResponse(
      res,
      {
        runId,
        ...result,
      },
      'Agentic AI agent cycle executed successfully'
    );
  });

  /**
   * Get agent run history
   * GET /api/commerce-agent/runs
   */
  getAgentRuns = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 20 } = req.query;

    const runs = await AgentOrchestrator.getAgentRuns(Number(limit));

    return successResponse(
      res,
      { runs },
      'Agent run history retrieved successfully'
    );
  });

  /**
   * Get specific agent run details
   * GET /api/commerce-agent/runs/:id
   */
  getAgentRun = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const run = await AgentOrchestrator.getAgentRun(id);

    if (!run) {
      return res.status(404).json({
        status: 'error',
        message: 'Agent run not found',
      });
    }

    return successResponse(
      res,
      { run },
      'Agent run details retrieved successfully'
    );
  });

  /**
   * Approve pending agent decisions (human-in-the-loop)
   * POST /api/commerce-agent/runs/:id/approve
   */
  approveDecisions = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const result = await AgentOrchestrator.approveDecisions(id, userId);

    return successResponse(
      res,
      { result },
      'Agent decisions approved and executed successfully'
    );
  });

  /**
   * Get seller opportunities
   * GET /api/commerce-agent/opportunities
   */
  getSellerOpportunities = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = (req as any).user?.userId;

    const opportunities = await commerceAgentService.getSellerOpportunities(sellerId);

    return successResponse(
      res,
      { opportunities },
      'Seller opportunities retrieved successfully'
    );
  });

  /**
   * Accept opportunity
   * POST /api/commerce-agent/opportunities/:id/accept
   */
  acceptOpportunity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const opportunity = await commerceAgentService.acceptOpportunity(id);

    return successResponse(
      res,
      { opportunity },
      'Opportunity accepted successfully'
    );
  });

  /**
   * Dismiss opportunity
   * POST /api/commerce-agent/opportunities/:id/dismiss
   */
  dismissOpportunity = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const opportunity = await commerceAgentService.dismissOpportunity(id);

    return successResponse(
      res,
      { opportunity },
      'Opportunity dismissed successfully'
    );
  });

  /**
   * Get campaign performance
   * GET /api/commerce-agent/campaigns/:id/performance
   */
  getCampaignPerformance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const performance = await commerceAgentService.getCampaignPerformance(id);

    return successResponse(
      res,
      { performance },
      'Campaign performance retrieved successfully'
    );
  });

  /**
   * Get agent decisions
   * GET /api/commerce-agent/decisions
   */
  getDecisions = asyncHandler(async (req: Request, res: Response) => {
    const { status, limit = 20 } = req.query;

    // Query agent decisions from database
    const decisions = await commerceAgentService.getAgentDecisions(
      status as string,
      Number(limit)
    );

    return successResponse(
      res,
      { decisions },
      'Agent decisions retrieved successfully'
    );
  });

  /**
   * Get agent actions
   * GET /api/commerce-agent/actions
   */
  getActions = asyncHandler(async (req: Request, res: Response) => {
    const { status, limit = 20 } = req.query;

    const actions = await commerceAgentService.getAgentActions(
      status as string,
      Number(limit)
    );

    return successResponse(
      res,
      { actions },
      'Agent actions retrieved successfully'
    );
  });

  /**
   * Get agent learning feedback
   * GET /api/commerce-agent/learning
   */
  getLearning = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 20 } = req.query;

    const learning = await commerceAgentService.getAgentLearning(Number(limit));

    return successResponse(
      res,
      { learning },
      'Agent learning feedback retrieved successfully'
    );
  });
}

export const commerceAgentController = new CommerceAgentController();