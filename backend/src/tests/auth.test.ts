import request from 'supertest';
import { createApp } from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication API', () => {
  let app: any;
  let accessToken: string;

  beforeAll(async () => {
    app = createApp();
    // Cleanup any existing test users
    await prisma.user.deleteMany({
      where: { email: { in: ['test-auth@example.com', 'test-auth2@example.com'] } }
    });
  });

  afterAll(async () => {
    // Cleanup test user
    await prisma.user.deleteMany({
      where: { email: { in: ['test-auth@example.com', 'test-auth2@example.com'] } }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new ADMIN user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-auth@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'ADMIN',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test-auth@example.com');
      expect(response.body.data.user.role).toBe('ADMIN');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
      
      accessToken = response.body.data.accessToken;
    }, 15000);

    it('should successfully register a new SELLER user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-auth2@example.com',
          password: 'password123',
          name: 'Test Seller',
          role: 'SELLER',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.role).toBe('SELLER');
      expect(response.body.data.accessToken).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-auth@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test-auth@example.com');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
      
      accessToken = response.body.data.accessToken;
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid access token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test-auth@example.com');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout with valid refresh token cookie', async () => {
      // First login to get refresh token cookie
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-auth@example.com',
          password: 'password123',
        });

      const cookies = loginResponse.headers['set-cookie'];
      
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.success).toBe(true);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should successfully refresh access token with valid refresh token', async () => {
      // First login to get refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-auth@example.com',
          password: 'password123',
        });

      const cookies = loginResponse.headers['set-cookie'];
      const oldAccessToken = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.accessToken).not.toBe(oldAccessToken);
    });
  });
});
