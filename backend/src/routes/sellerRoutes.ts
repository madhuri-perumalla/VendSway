import { Router } from 'express';
import { SellerController } from '../controllers/SellerController';
import { SellerMatchingService } from '../services/SellerMatchingService';
import { SellerRepository } from '../repositories/SellerRepository';
import { GapRepository } from '../repositories/GapRepository';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth';
import prisma from '../config/database';

/**
 * Seller Discovery routes
 * Handles seller discovery and matching endpoints
 */
const router = Router();

// Initialize controller
const sellerRepository = new SellerRepository(prisma);
const gapRepository = new GapRepository(prisma);
const sellerMatchingService = new SellerMatchingService(sellerRepository, gapRepository);
const sellerController = new SellerController(sellerMatchingService, sellerRepository);

/**
 * @route   POST /api/sellers/match
 * @desc    Find matching sellers for a catalog gap
 * @access  Public
 */
router.post('/match', sellerController.findMatchingSellers);

/**
 * @route   GET /api/sellers/gi/:giProductId
 * @desc    Find sellers for GI product
 * @access  Public
 */
router.get('/gi/:giProductId', sellerController.findSellersForGIProduct);

/**
 * @route   GET /api/sellers/recommendations/:regionId
 * @desc    Get seller recommendations for a region
 * @access  Public
 */
router.get('/recommendations/:regionId', sellerController.getSellerRecommendations);

/**
 * @route   POST /api/sellers/batch-match
 * @desc    Batch match sellers for gaps
 * @access  Admin
 */
router.post('/batch-match', authenticate, adminOnly, sellerController.batchMatchSellersForGaps);

/**
 * @route   GET /api/sellers/rank/:gapId
 * @desc    Rank sellers for a specific gap
 * @access  Public
 */
router.get('/rank/:gapId', sellerController.rankSellersForGap);

/**
 * @route   GET /api/sellers/region/:regionId
 * @desc    Get sellers by region
 * @access  Public
 */
router.get('/region/:regionId', sellerController.getSellersByRegion);

/**
 * @route   GET /api/sellers/category/:category
 * @desc    Get sellers by category
 * @access  Public
 */
router.get('/category/:category', sellerController.getSellersByCategory);

/**
 * @route   GET /api/sellers/search
 * @desc    Search sellers
 * @access  Public
 */
router.get('/search', sellerController.searchSellers);

/**
 * @route   GET /api/sellers/top-rated
 * @desc    Get top rated sellers
 * @access  Public
 */
router.get('/top-rated', sellerController.getTopRatedSellers);

/**
 * @route   GET /api/sellers/statistics
 * @desc    Get seller statistics
 * @access  Admin
 */
router.get('/statistics', authenticate, adminOnly, sellerController.getSellerStatistics);

/**
 * @route   POST /api/sellers/register
 * @desc    Register a new seller (PENDING status)
 * @access  Public (Demo mode)
 */
router.post('/register', optionalAuth, sellerController.registerSeller);

/**
 * @route   GET /api/sellers/applications/status
 * @desc    Get seller application status by email
 * @access  Public (Demo mode)
 */
router.get('/applications/status', optionalAuth, sellerController.getApplicationByEmail);

/**
 * @route   GET /api/sellers/applications
 * @desc    Get all seller applications
 * @access  Public (Demo mode)
 */
router.get('/applications', optionalAuth, sellerController.getSellerApplications);

/**
 * @route   PUT /api/sellers/applications/:id/approve
 * @desc    Approve a seller application
 * @access  Public (Demo mode)
 */
router.put('/applications/:id/approve', optionalAuth, sellerController.approveSellerApplication);

/**
 * @route   PUT /api/sellers/applications/:id/reject
 * @desc    Reject a seller application
 * @access  Public (Demo mode)
 */
router.put('/applications/:id/reject', optionalAuth, sellerController.rejectSellerApplication);

/**
 * @route   PATCH /api/sellers/:id/withdraw
 * @desc    Withdraw a seller application (seller-initiated)
 * @access  Public (Demo mode)
 */
router.patch('/:id/withdraw', optionalAuth, sellerController.withdrawApplication);

/**
 * @route   PATCH /api/sellers/:id/deactivate
 * @desc    Deactivate a seller account
 * @access  Public (Demo mode)
 */
router.patch('/:id/deactivate', optionalAuth, sellerController.deactivateSellerAccount);

/**
 * @route   GET /api/sellers/:id
 * @desc    Get seller with products
 * @access  Public
 */
router.get('/:id', sellerController.getSellerWithProducts);

export default router;
