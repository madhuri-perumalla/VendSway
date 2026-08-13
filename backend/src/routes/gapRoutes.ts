import { Router } from 'express';
import { GapController } from '../controllers/GapController';
import { GapCalculationService } from '../services/GapCalculationService';
import { GapRepository } from '../repositories/GapRepository';
import { DemandRepository } from '../repositories/DemandRepository';
import { authenticate, adminOnly } from '../middleware/auth';
import prisma from '../config/database';

/**
 * Catalog Gap routes
 * Handles catalog gap detection endpoints
 */
const router = Router();

// Initialize controller
const gapRepository = new GapRepository(prisma);
const demandRepository = new DemandRepository(prisma);
const gapCalculationService = new GapCalculationService(gapRepository, demandRepository);
const gapController = new GapController(gapCalculationService, gapRepository);

/**
 * @route   POST /api/gaps/calculate
 * @desc    Calculate catalog gap for region-category combination
 * @access  Public
 */
router.post('/calculate', gapController.calculateGap);

/**
 * @route   POST /api/gaps/detect
 * @desc    Calculate and store catalog gap
 * @access  Admin
 */
router.post('/detect', authenticate, adminOnly, gapController.detectGap);

/**
 * @route   POST /api/gaps/batch-detect
 * @desc    Batch calculate gaps for multiple regions and categories
 * @access  Admin
 */
router.post('/batch-detect', authenticate, adminOnly, gapController.batchDetectGaps);

/**
 * @route   GET /api/gaps/missing/:regionId
 * @desc    Get missing categories for a region
 * @access  Public
 */
router.get('/missing/:regionId', gapController.getMissingCategories);

/**
 * @route   GET /api/gaps/shortage/:regionId
 * @desc    Get demand shortage summary for a region
 * @access  Public
 */
router.get('/shortage/:regionId', gapController.getDemandShortageSummary);

/**
 * @route   GET /api/gaps/analysis/:regionId
 * @desc    Get gap analysis for a region
 * @access  Public
 */
router.get('/analysis/:regionId', gapController.getGapAnalysis);

/**
 * @route   GET /api/gaps/region/:regionId
 * @desc    Get gaps by region
 * @access  Public
 */
router.get('/region/:regionId', gapController.getGapsByRegion);

/**
 * @route   GET /api/gaps/priority/:priority
 * @desc    Get gaps by priority
 * @access  Public
 */
router.get('/priority/:priority', gapController.getGapsByPriority);

/**
 * @route   GET /api/gaps/unresolved
 * @desc    Get unresolved gaps
 * @access  Public
 */
router.get('/unresolved', gapController.getUnresolvedGaps);

/**
 * @route   POST /api/gaps/:id/resolve
 * @desc    Resolve a catalog gap
 * @access  Admin
 */
router.post('/:id/resolve', authenticate, adminOnly, gapController.resolveGap);

/**
 * @route   GET /api/gaps/top-priority
 * @desc    Get top priority gaps
 * @access  Public
 */
router.get('/top-priority', gapController.getTopPriorityGaps);

/**
 * @route   GET /api/gaps
 * @desc    Get gaps with filters
 * @access  Public
 */
router.get('/', gapController.getGaps);

export default router;
