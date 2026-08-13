import { Router } from 'express';
import { RegionalIntelligenceController } from '../controllers/RegionalIntelligenceController';
import { optionalAuth } from '../middleware/auth';
import prisma from '../config/database';
import { RegionRepository } from '../repositories/RegionRepository';
import { RegionalIntelligenceService } from '../services/RegionalIntelligenceService';

/**
 * Regional Intelligence routes
 * Handles regional fashion knowledge endpoints
 */
const router = Router();

// Initialize controller
const regionRepository = new RegionRepository(prisma);
const regionalIntelligenceService = new RegionalIntelligenceService(regionRepository);
const regionalIntelligenceController = new RegionalIntelligenceController(regionalIntelligenceService);

/**
 * @route   GET /api/intelligence/regions
 * @desc    Get all regions for map display
 * @access  Public
 */
router.get('/regions', optionalAuth, regionalIntelligenceController.getAllRegions);

/**
 * @route   GET /api/intelligence/regions/search
 * @desc    Search regions by name or code
 * @access  Public
 */
router.get('/regions/search', optionalAuth, regionalIntelligenceController.searchRegions);

/**
 * @route   GET /api/intelligence/regions/:id
 * @desc    Get region details with all related data
 * @access  Public
 */
router.get('/regions/:id', optionalAuth, regionalIntelligenceController.getRegionDetails);

/**
 * @route   GET /api/intelligence/regions/:id/textiles
 * @desc    Get textiles by region
 * @access  Public
 */
router.get('/regions/:id/textiles', optionalAuth, regionalIntelligenceController.getRegionalTextiles);

/**
 * @route   GET /api/intelligence/regions/:id/festivals
 * @desc    Get festivals by region
 * @access  Public
 */
router.get('/regions/:id/festivals', optionalAuth, regionalIntelligenceController.getRegionalFestivals);

/**
 * @route   GET /api/intelligence/regions/:id/gi-products
 * @desc    Get GI products by region
 * @access  Public
 */
router.get('/regions/:id/gi-products', optionalAuth, regionalIntelligenceController.getRegionalGIProducts);

/**
 * @route   GET /api/intelligence/regions/:id/trends
 * @desc    Get regional trends
 * @access  Public
 */
router.get('/regions/:id/trends', optionalAuth, regionalIntelligenceController.getRegionalTrends);

/**
 * @route   GET /api/intelligence/regions/:id/summary
 * @desc    Get regional summary for dashboard
 * @access  Public
 */
router.get('/regions/:id/summary', optionalAuth, regionalIntelligenceController.getRegionalSummary);

export default router;
