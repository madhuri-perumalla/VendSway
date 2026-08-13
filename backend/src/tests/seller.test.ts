import request from 'supertest';
import { createApp } from '../app';

describe('Seller API', () => {
  let app: any;
  let adminSessionId: string;
  let sellerSessionId: string;

  beforeAll(async () => {
    app = createApp();
    
    // Login as admin
    const adminAuthResponse = await request(app)
      .post('/api/auth/select-role')
      .send({ role: 'ADMIN' });
    
    adminSessionId = adminAuthResponse.body.data.sessionId;

    // Login as seller
    const sellerAuthResponse = await request(app)
      .post('/api/auth/select-role')
      .send({ role: 'SELLER' });
    
    sellerSessionId = sellerAuthResponse.body.data.sessionId;
  });

  describe('POST /api/sellers/match', () => {
    it('should find matching sellers', async () => {
      const response = await request(app)
        .post('/api/sellers/match')
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('matches');
      expect(Array.isArray(response.body.data.matches)).toBe(true);
    });

    it('should require regionId and category', async () => {
      const response = await request(app)
        .post('/api/sellers/match')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/sellers/region/:regionId', () => {
    it('should get sellers by region', async () => {
      const response = await request(app)
        .get('/api/sellers/region/test-region-id');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/sellers/category/:category', () => {
    it('should get sellers by category', async () => {
      const response = await request(app)
        .get('/api/sellers/category/test-category');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/sellers/search', () => {
    it('should search sellers', async () => {
      const response = await request(app)
        .get('/api/sellers/search?q=test');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should require search query', async () => {
      const response = await request(app)
        .get('/api/sellers/search');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/sellers/top-rated', () => {
    it('should get top rated sellers', async () => {
      const response = await request(app)
        .get('/api/sellers/top-rated');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/sellers/statistics', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/sellers/statistics');

      expect(response.status).toBe(401);
    });

    it('should get seller statistics with admin auth', async () => {
      const response = await request(app)
        .get('/api/sellers/statistics')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/sellers/statistics')
        .set('Cookie', [`session=${sellerSessionId}`]);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sellers/batch-match', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .post('/api/sellers/batch-match')
        .send({ regionId: 'test-region-id' });

      expect(response.status).toBe(401);
    });

    it('should batch match sellers with admin auth', async () => {
      const response = await request(app)
        .post('/api/sellers/batch-match')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({ regionId: 'test-region-id' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });
});
