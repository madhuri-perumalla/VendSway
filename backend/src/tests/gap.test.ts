import request from 'supertest';
import { createApp } from '../app';

describe('Gap API', () => {
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

  describe('POST /api/gaps/calculate', () => {
    it('should calculate gap', async () => {
      const response = await request(app)
        .post('/api/gaps/calculate')
        .set('Cookie', [`session=${sessionId}`])
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('gap');
    });

    it('should require regionId and category', async () => {
      const response = await request(app)
        .post('/api/gaps/calculate')
        .set('Cookie', [`session=${sessionId}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/gaps/detect', () => {
    it('should detect gaps', async () => {
      const response = await request(app)
        .post('/api/gaps/detect')
        .set('Cookie', [`session=${sessionId}`])
        .send({
          regionId: 'test-region-id',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/gaps/batch', () => {
    it('should batch detect gaps', async () => {
      const response = await request(app)
        .post('/api/gaps/batch')
        .set('Cookie', [`session=${sessionId}`])
        .send({
          regionIds: ['region1', 'region2'],
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /api/gaps/missing-categories/:regionId', () => {
    it('should get missing categories', async () => {
      const response = await request(app)
        .get('/api/gaps/missing-categories/test-region-id')
        .set('Cookie', [`session=${sessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/gaps/shortage-summary/:regionId', () => {
    it('should get shortage summary', async () => {
      const response = await request(app)
        .get('/api/gaps/shortage-summary/test-region-id')
        .set('Cookie', [`session=${sessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /api/gaps/analysis/:regionId', () => {
    it('should get gap analysis', async () => {
      const response = await request(app)
        .get('/api/gaps/analysis/test-region-id')
        .set('Cookie', [`session=${sessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('Authorization', () => {
    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .post('/api/gaps/calculate')
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
        .post('/api/gaps/calculate')
        .set('Cookie', [`session=${sellerSessionId}`])
        .send({
          regionId: 'test-region-id',
          category: 'test-category',
        });

      expect(response.status).toBe(403);
    });
  });
});
