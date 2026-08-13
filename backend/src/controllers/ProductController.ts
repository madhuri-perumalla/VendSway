import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, createdResponse } from '../utils/responseFormatter';
import { ProductRepository } from '../repositories/ProductRepository';
import { SellerRepository } from '../repositories/SellerRepository';
import prisma from '../config/database';

export class ProductController {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository, _sellerRepository?: SellerRepository) {
    this.productRepository = productRepository;
  }

  /** POST /api/products — create product (PENDING) */
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { sellerId, name, category, description, price, stock, imageUrl, regionId, customRegion } = req.body;
    if (!sellerId || !name || !category || !price) {
      return res.status(400).json({ status: 'error', message: 'sellerId, name, category, and price are required' });
    }
    const product = await prisma.product.create({
      data: {
        sellerId, name, category,
        description: description || null,
        price,
        stock: stock || 0,
        imageUrl: imageUrl || null,
        regionId: regionId || null,
        customRegion: customRegion || null,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: { region: true },
    });
    return createdResponse(res, product, 'Product created successfully');
  });

  /** GET /api/products/pending — all pending (admin) */
  getPendingProducts = asyncHandler(async (_req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      where: { status: 'PENDING' },
      include: { seller: { include: { region: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(res, products, 'Pending products retrieved successfully');
  });

  /** GET /api/products/seller/:sellerId — all products for a seller with search, filters, pagination */
  getProductsBySeller = asyncHandler(async (req: Request, res: Response) => {
    const { sellerId } = req.params;
    const { search, status, available, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { sellerId };

    // Search by product name
    if (search && typeof search === 'string') {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Filter by status
    if (status && typeof status === 'string') {
      where.status = status;
    }

    // Filter by availability
    if (available !== undefined) {
      where.available = available === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { region: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse(res, {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    }, 'Products retrieved successfully');
  });

  /** GET /api/products/:id */
  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { seller: true, region: true },
    });
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    return successResponse(res, product, 'Product retrieved successfully');
  });

  /** PATCH /api/products/:id — seller edits */
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, regionId, customRegion } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ status: 'error', message: 'Product not found' });

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (regionId !== undefined) updateData.regionId = regionId || null;
    if (customRegion !== undefined) updateData.customRegion = customRegion || null;

    const product = await prisma.product.update({ where: { id }, data: updateData, include: { region: true } });
    return successResponse(res, product, 'Product updated successfully');
  });

  /** DELETE /api/products/:id — soft delete (set available=false) */
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

    // Soft delete: set available to false instead of deleting
    const updated = await prisma.product.update({
      where: { id },
      data: { available: false, updatedAt: new Date() },
    });
    return successResponse(res, updated, 'Product deleted successfully');
  });

  /** PATCH /api/products/:id/resubmit — REJECTED → PENDING */
  resubmitProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    if (product.status !== 'REJECTED') {
      return res.status(400).json({ status: 'error', message: 'Only rejected products can be resubmitted' });
    }
    const updated = await prisma.product.update({
      where: { id },
      data: { status: 'PENDING', adminFeedback: null, updatedAt: new Date() },
    });
    return successResponse(res, updated, 'Product resubmitted for review');
  });

  /** PUT /api/products/:id/approve — admin approves */
  approveProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: { status: 'APPROVED', adminFeedback: null, updatedAt: new Date() },
    });
    return successResponse(res, product, 'Product approved successfully');
  });

  /** PUT /api/products/:id/reject — admin rejects with optional feedback */
  rejectProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { feedback } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { status: 'REJECTED', adminFeedback: feedback || null, updatedAt: new Date() },
    });
    return successResponse(res, product, 'Product rejected successfully');
  });

  /** POST /api/products/:id/deactivate */
  deactivateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productRepository.deactivateProduct(id);
    return successResponse(res, product, 'Product deactivated successfully');
  });

  /** POST /api/products/:id/activate */
  activateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productRepository.activateProduct(id);
    return successResponse(res, product, 'Product activated successfully');
  });

  /** GET /api/products/region/:regionId */
  getProductsByRegion = asyncHandler(async (req: Request, res: Response) => {
    const { regionId } = req.params;
    const products = await this.productRepository.getProductsByRegion(regionId);
    return successResponse(res, products, 'Products retrieved successfully');
  });

  /** GET /api/products/gi/:giProductId */
  getProductsByGIProduct = asyncHandler(async (req: Request, res: Response) => {
    const { giProductId } = req.params;
    const products = await this.productRepository.getProductsByGIProduct(giProductId);
    return successResponse(res, products, 'Products retrieved successfully');
  });

  /** GET /api/products/seller/:sellerId/search?q= */
  searchProductsBySeller = asyncHandler(async (req: Request, res: Response) => {
    const { sellerId } = req.params;
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Search query q is required' });
    }
    const products = await this.productRepository.searchProductsBySeller(sellerId, q);
    return successResponse(res, products, 'Search results retrieved successfully');
  });

  /** GET /api/products/seller/:sellerId/statistics */
  getProductStatistics = asyncHandler(async (req: Request, res: Response) => {
    const { sellerId } = req.params;
    const statistics = await this.productRepository.getProductStatistics(sellerId);
    return successResponse(res, statistics, 'Product statistics retrieved successfully');
  });
}
