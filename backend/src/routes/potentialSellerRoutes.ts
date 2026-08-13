import { Router } from 'express';
import multer from 'multer';
import { PotentialSellerController } from '../controllers/PotentialSellerController';
import { optionalAuth } from '../middleware/auth';

const router = Router();
const potentialSellerController = new PotentialSellerController();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  },
});

/**
 * Potential Seller Routes
 * All routes require admin authentication
 */

// Dashboard statistics
router.get(
  '/statistics',
  optionalAuth,
  potentialSellerController.getDashboardStatistics
);

// Get all potential sellers with filters
router.get(
  '/',
  optionalAuth,
  potentialSellerController.getAllPotentialSellers
);

// Search potential sellers
router.get(
  '/search',
  optionalAuth,
  potentialSellerController.searchPotentialSellers
);

// Get potential seller by ID
router.get(
  '/:id',
  optionalAuth,
  potentialSellerController.getPotentialSellerById
);

// Create potential seller
router.post(
  '/',
  optionalAuth,
  potentialSellerController.createPotentialSeller
);

// Update potential seller
router.put(
  '/:id',
  optionalAuth,
  potentialSellerController.updatePotentialSeller
);

// Delete potential seller
router.delete(
  '/:id',
  optionalAuth,
  potentialSellerController.deletePotentialSeller
);

// Send invitation
router.post(
  '/:id/invite',
  optionalAuth,
  potentialSellerController.sendInvitation
);

// Mark as interested
router.post(
  '/:id/interested',
  optionalAuth,
  potentialSellerController.markAsInterested
);

// Archive potential seller
router.post(
  '/:id/archive',
  optionalAuth,
  potentialSellerController.archivePotentialSeller
);

// Import potential sellers from file
router.post(
  '/import',
  optionalAuth,
  upload.single('file'),
  potentialSellerController.importPotentialSellers
);

// Get import history
router.get(
  '/import/history',
  optionalAuth,
  potentialSellerController.getImportHistory
);

// Get import template
router.get(
  '/import/template',
  optionalAuth,
  potentialSellerController.getImportTemplate
);

// Get invitations
router.get(
  '/invitations/all',
  optionalAuth,
  potentialSellerController.getInvitations
);

// Get invitations by potential seller
router.get(
  '/:id/invitations',
  optionalAuth,
  potentialSellerController.getInvitationsByPotentialSeller
);

export default router;
