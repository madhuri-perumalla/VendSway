import { Router } from 'express';
import { DemandController } from '../controllers/DemandController';
import { DemandCalculationService } from '../services/DemandCalculationService';
import { DemandRepository } from '../repositories/DemandRepository';
import { authenticate, adminOnly } from '../middleware/auth';
import prisma from '../config/database';

/**
 * Demand Intelligence routes
 * Handles demand scoring and calculation endpoints
 */
const router = Router();

// Initialize controller
const demandRepository = new DemandRepository(prisma);
const demandCalculationService = new DemandCalculationService(demandRepository);
const demandController = new DemandController(demandCalculationService, demandRepository);

/**
 * @route   POST /api/demand/calculate
 * @desc    Calculate demand score for region-category combination
 * @access  Public
 */
router.post('/calculate', demandController.calculateDemand);

/**
 * @route   POST /api/demand/signal
 * @desc    Calculate and store demand signal
 * @access  Admin
 */
router.post('/signal', authenticate, adminOnly, demandController.createDemandSignal);

/**
 * @route   POST /api/demand/batch-calculate
 * @desc    Batch calculate demand signals
 * @access  Admin
 */
router.post('/batch-calculate', authenticate, adminOnly, demandController.batchCalculateDemandSignals);

/**
 * @route   GET /api/demand/analysis/:regionId
 * @desc    Get demand analysis for a region
 * @access  Public
 */
router.get('/analysis/:regionId', demandController.getDemandAnalysis);

/**
 * @route   GET /api/demand/region/:regionId
 * @desc    Get demand signals by region
 * @access  Public
 */
router.get('/region/:regionId', demandController.getDemandSignalsByRegion);

/**
 * @route   GET /api/demand/high-demand
 * @desc    Get high demand signals (score > 70)
 * @access  Public
 */
router.get('/high-demand', demandController.getHighDemandSignals);

export default router;
