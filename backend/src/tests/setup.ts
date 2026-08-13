import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database if needed
  // For now, we'll use the existing database
});

afterAll(async () => {
  // Cleanup test data if needed
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up test data before each test
  // This is a simple cleanup - in production, use transactions
});

afterEach(async () => {
  // Cleanup after each test
});
