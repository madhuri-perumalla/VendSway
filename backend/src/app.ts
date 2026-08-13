import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import authRoutes from './routes/authRoutes';
import notificationRoutes from './routes/notificationRoutes';
import regionalIntelligenceRoutes from './routes/regionalIntelligenceRoutes';
import demandRoutes from './routes/demandRoutes';
import gapRoutes from './routes/gapRoutes';
import sellerRoutes from './routes/sellerRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import productRoutes from './routes/productRoutes';
import potentialSellerRoutes from './routes/potentialSellerRoutes';
import commerceAgentRoutes from './routes/commerceAgentRoutes';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      const allowedOrigins = config.cors.origin.split(',').map(o => o.trim());
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Also allow any localhost or 127.0.0.1 port in development
      if (process.env.NODE_ENV !== 'production' && 
          (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin))) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Health check route
  app.get('/health', (_req, res) => {
    res.json({
      status: 'success',
      message: 'VendSway Backend API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/intelligence', regionalIntelligenceRoutes);
  app.use('/api/demand', demandRoutes);
  app.use('/api/gaps', gapRoutes);
  app.use('/api/sellers', sellerRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/admin/potential-sellers', potentialSellerRoutes);
  app.use('/api/commerce-agent', commerceAgentRoutes);

  return app;
};
