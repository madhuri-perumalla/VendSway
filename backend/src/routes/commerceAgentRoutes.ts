// ============================================================================
// COMMERCE AGENT ROUTES
// ============================================================================
// Routes for Agentic AI Commerce Agent endpoints

import { Router } from 'express';
import { authenticate, adminOnly } from '../middleware/auth';
import { commerceAgentController } from '../controllers/CommerceAgentController';

const router = Router();

/**
 * @route   POST /api/commerce-agent/run
 * @desc    Run the Agentic AI agent cycle with human-in-the-loop controls
 * @access  Admin
 */
router.post('/run', authenticate, adminOnly, commerceAgentController.runAgent);

/**
 * @route   GET /api/commerce-agent/runs
 * @desc    Get agent run history
 * @access  Admin
 */
router.get('/runs', authenticate, adminOnly, commerceAgentController.getAgentRuns);

/**
 * @route   GET /api/commerce-agent/runs/:id
 * @desc    Get specific agent run details
 * @access  Admin
 */
router.get('/runs/:id', authenticate, adminOnly, commerceAgentController.getAgentRun);

/**
 * @route   POST /api/commerce-agent/runs/:id/approve
 * @desc    Approve pending agent decisions (human-in-the-loop)
 * @access  Admin
 */
router.post('/runs/:id/approve', authenticate, adminOnly, commerceAgentController.approveDecisions);

/**
 * @route   GET /api/commerce-agent/decisions
 * @desc    Get agent decisions
 * @access  Admin
 */
router.get('/decisions', authenticate, adminOnly, commerceAgentController.getDecisions);

/**
 * @route   GET /api/commerce-agent/actions
 * @desc    Get agent actions
 * @access  Admin
 */
router.get('/actions', authenticate, adminOnly, commerceAgentController.getActions);

/**
 * @route   GET /api/commerce-agent/learning
 * @desc    Get agent learning feedback
 * @access  Admin
 */
router.get('/learning', authenticate, adminOnly, commerceAgentController.getLearning);

/**
 * @route   GET /api/commerce-agent/opportunities
 * @desc    Get opportunities for authenticated seller
 * @access  Seller
 */
router.get('/opportunities', authenticate, commerceAgentController.getSellerOpportunities);

/**
 * @route   POST /api/commerce-agent/opportunities/:id/accept
 * @desc    Accept an opportunity
 * @access  Seller
 */
router.post('/opportunities/:id/accept', authenticate, commerceAgentController.acceptOpportunity);

/**
 * @route   POST /api/commerce-agent/opportunities/:id/dismiss
 * @desc    Dismiss an opportunity
 * @access  Seller
 */
router.post('/opportunities/:id/dismiss', authenticate, commerceAgentController.dismissOpportunity);

/**
 * @route   GET /api/commerce-agent/campaigns/:id/performance
 * @desc    Get campaign performance metrics
 * @access  Seller
 */
router.get('/campaigns/:id/performance', authenticate, commerceAgentController.getCampaignPerformance);

export default router;
