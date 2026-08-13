import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { AnalyticsService } from '../services/AnalyticsService';
import { DemandRepository } from '../repositories/DemandRepository';
import { GapRepository } from '../repositories/GapRepository';
import { SellerRepository } from '../repositories/SellerRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { optionalAuth } from '../middleware/auth';
import prisma from '../config/database';

/**
 * Analytics routes
 * Handles dashboard analytics endpoints
 */
const router = Router();

// Initialize controller
const demandRepository = new DemandRepository(prisma);
const gapRepository = new GapRepository(prisma);
const sellerRepository = new SellerRepository(prisma);
const productRepository = new ProductRepository(prisma);
const analyticsService = new AnalyticsService(demandRepository, gapRepository, sellerRepository, productRepository);
const analyticsController = new AnalyticsController(analyticsService);

/**
 * @route   GET /api/analytics/demand
 * @desc    Get demand analytics
 * @access  Public (Demo mode)
 */
router.get('/demand', optionalAuth, analyticsController.getDemandAnalytics);

/**
 * @route   GET /api/analytics/gaps
 * @desc    Get gap analytics
 * @access  Public (Demo mode)
 */
router.get('/gaps', optionalAuth, analyticsController.getGapAnalytics);

/**
 * @route   GET /api/analytics/sellers
 * @desc    Get seller analytics
 * @access  Public (Demo mode)
 */
router.get('/sellers', optionalAuth, analyticsController.getSellerAnalytics);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard overview
 * @access  Public (Demo mode)
 */
router.get('/dashboard', optionalAuth, analyticsController.getDashboardOverview);

/**
 * @route   GET /api/analytics/recent-activity
 * @desc    Get recent activity (notifications + seller audit logs)
 * @access  Admin (optionalAuth)
 */
router.get('/recent-activity', optionalAuth, async (_req, res) => {
  try {
    // Fetch latest notifications and audit logs
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const auditLogs = await prisma.sellerAuditLog.findMany({
      orderBy: { actionDate: 'desc' },
      take: 10,
    });

    // Normalize and merge
    const normalizedNotifications = notifications.map(n => ({
      type: 'notification',
      id: n.id,
      title: n.title,
      detail: `User #${n.userId}`,
      date: n.createdAt,
    }));

    const normalizedAudits = auditLogs.map(a => ({
      type: 'audit',
      id: a.id,
      title: a.action,
      detail: `Seller #${a.sellerId} — ${a.performedBy}`,
      date: a.actionDate || a.createdAt,
    }));

    const merged = [...normalizedNotifications, ...normalizedAudits]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return res.json({ status: 'success', data: merged });
  } catch (error) {
    console.error('Failed to load recent activity:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to load recent activity' });
  }
});

/**
 * @route   POST /api/analytics/regional-comparison
 * @desc    Get regional comparison
 * @access  Public (Demo mode)
 */
router.post('/regional-comparison', optionalAuth, analyticsController.getRegionalComparison);

/**
 * @route   GET /api/analytics/categories
 * @desc    Get unique categories
 * @access  Public
 */
router.get('/categories', optionalAuth, analyticsController.getCategories);

/**
 * @route   GET /api/analytics/festivals
 * @desc    Get unique festivals
 * @access  Public
 */
router.get('/festivals', optionalAuth, analyticsController.getFestivals);

export default router;
