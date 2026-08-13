import { createApp } from './app';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import config from './config';
import prisma from './config/database';
import scheduler from './utils/scheduler';

const app = createApp();

// Middleware
app.use(requestLogger);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection test
const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      
      // Start the Commerce Agent Scheduler
      if (config.nodeEnv !== 'test') {
        scheduler.start(4 * 60 * 60 * 1000); // Run every 4 hours
        console.log('Commerce Agent Scheduler started');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
