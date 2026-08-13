import request from 'supertest';
import { createApp } from '../app';

describe('Demand API', () => {
  let app: any;
  let sessionId: string;

  beforeAll(async () => {
    app = createApp();
    
    // Login as admin for protected routes
    const authResponse = await request(app)
      .post('/api/auth/select-role')
      .send({ role: 'ADMIN' });
    
    sessionId = authResponse.body.data.sessionId;
  });

  describe('POST /api/demand/calculate', () => {
    it('should calculate demand score', async () => {
      const response = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${sessionId}`])
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
          festivalId: 'test-festival-id',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('demandScore');
    });

    it('should require regionId and category', async () => {
      const response = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${sessionId}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/demand/signals', () => {
    it('should create demand signal', async () => {
      const response = await request(app)
        .post('/api/demand/signals')
        .set('Cookie', [`session=${sessionId}`])
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
          demandScore: 75,
          period: '2024-Q1',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('POST /api/demand/batch', () => {
    it('should batch calculate demand', async () => {
      const response = await request(app)
        .post('/api/demand/batch')
        .set('Cookie', [`session=${sessionId}`])
        .send({
          regionId: 'test-region-id',
          categories: ['category1', 'category2'],
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/demand/analysis/:regionId', () => {
    it('should get demand analysis', async () => {
      const response = await request(app)
        .get('/api/demand/analysis/test-region-id')
        .set('Cookie', [`session=${sessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /api/demand/high-demand/:regionId', () => {
    it('should get high demand signals', async () => {
      const response = await request(app)
        .get('/api/demand/high-demand/test-region-id')
        .set('Cookie', [`session=${sessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Authorization', () => {
    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .post('/api/demand/calculate')
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
        });

      expect(response.status).toBe(401);
    });

    it('should reject non-admin users', async () => {
      const sellerAuthResponse = await request(app)
        .post('/api/auth/select-role')
        .send({ role: 'SELLER' });
      
      const sellerSessionId = sellerAuthResponse.body.data.sessionId;

      const response = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${sellerSessionId}`])
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
        });

      expect(response.status).toBe(403);
    });
  });
});
