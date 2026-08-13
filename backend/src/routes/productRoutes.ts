import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductRepository } from '../repositories/ProductRepository';
import { SellerRepository } from '../repositories/SellerRepository';
import { optionalAuth } from '../middleware/auth';
import prisma from '../config/database';

const router = Router();

const productRepository = new ProductRepository(prisma);
const sellerRepository = new SellerRepository(prisma);
const productController = new ProductController(productRepository, sellerRepository);

// ── Seller product management ─────────────────────────────────────────────────
// Must be above /:id to avoid route shadowing

/** GET  /api/products/seller/:sellerId  — all products for a seller */
router.get('/seller/:sellerId', optionalAuth, productController.getProductsBySeller);

/** GET  /api/products/pending  — admin: all pending products */
router.get('/pending', optionalAuth, productController.getPendingProducts);

/** GET  /api/products/region/:regionId */
router.get('/region/:regionId', productController.getProductsByRegion);

// ── Single product ────────────────────────────────────────────────────────────

/** GET    /api/products/:id */
router.get('/:id', productController.getProductById);

/** POST   /api/products  — create (PENDING) */
router.post('/', optionalAuth, productController.createProduct);

/** PATCH  /api/products/:id  — seller edits name/desc/price/stock/image */
router.patch('/:id', optionalAuth, productController.updateProduct);

/** DELETE /api/products/:id  — seller deletes */
router.delete('/:id', optionalAuth, productController.deleteProduct);

/** PATCH  /api/products/:id/resubmit  — REJECTED → PENDING */
router.patch('/:id/resubmit', optionalAuth, productController.resubmitProduct);

// ── Admin actions ─────────────────────────────────────────────────────────────

/** PUT /api/products/:id/approve */
router.put('/:id/approve', optionalAuth, productController.approveProduct);

/** PUT /api/products/:id/reject  — body: { feedback?: string } */
router.put('/:id/reject', optionalAuth, productController.rejectProduct);

/** POST /api/products/:id/deactivate */
router.post('/:id/deactivate', optionalAuth, productController.deactivateProduct);

/** POST /api/products/:id/activate */
router.post('/:id/activate', optionalAuth, productController.activateProduct);

export default router;
