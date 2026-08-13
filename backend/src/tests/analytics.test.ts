import request from 'supertest';
import { createApp } from '../app';

describe('Analytics API', () => {
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

  describe('GET /api/analytics/demand', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/analytics/demand');

      expect(response.status).toBe(401);
    });

    it('should get demand analytics with admin auth', async () => {
      const response = await request(app)
        .get('/api/analytics/demand')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.data).toHaveProperty('byRegion');
      expect(response.body.data).toHaveProperty('byCategory');
      expect(response.body.data).toHaveProperty('trend');
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/analytics/demand')
        .set('Cookie', [`session=${sellerSessionId}`]);

      expect(response.status).toBe(403);
    });

    it('should support filtering by region', async () => {
      const response = await request(app)
        .get('/api/analytics/demand?regionId=test-region-id')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should support filtering by category', async () => {
      const response = await request(app)
        .get('/api/analytics/demand?category=sarees')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should support date range filtering', async () => {
      const response = await request(app)
        .get('/api/analytics/demand?startDate=2024-01-01&endDate=2024-12-31')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /api/analytics/gaps', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/analytics/gaps');

      expect(response.status).toBe(401);
    });

    it('should get gap analytics with admin auth', async () => {
      const response = await request(app)
        .get('/api/analytics/gaps')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.data).toHaveProperty('byPriority');
      expect(response.body.data).toHaveProperty('byRegion');
      expect(response.body.data).toHaveProperty('byCategory');
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/analytics/gaps')
        .set('Cookie', [`session=${sellerSessionId}`]);

      expect(response.status).toBe(403);
    });

    it('should support filtering by priority', async () => {
      const response = await request(app)
        .get('/api/analytics/gaps?priority=HIGH')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /api/analytics/sellers', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/analytics/sellers');

      expect(response.status).toBe(401);
    });

    it('should get seller analytics with admin auth', async () => {
      const response = await request(app)
        .get('/api/analytics/sellers')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.data).toHaveProperty('byStatus');
      expect(response.body.data).toHaveProperty('byRegion');
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/analytics/sellers')
        .set('Cookie', [`session=${sellerSessionId}`]);

      expect(response.status).toBe(403);
    });

    it('should support filtering by status', async () => {
      const response = await request(app)
        .get('/api/analytics/sellers?status=APPROVED')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /api/analytics/dashboard', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/analytics/dashboard');

      expect(response.status).toBe(401);
    });

    it('should get dashboard overview with admin auth', async () => {
      const response = await request(app)
        .get('/api/analytics/dashboard')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('demand');
      expect(response.body.data).toHaveProperty('gaps');
      expect(response.body.data).toHaveProperty('sellers');
      expect(response.body.data).toHaveProperty('trends');
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/analytics/dashboard')
        .set('Cookie', [`session=${sellerSessionId}`]);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/analytics/regional-comparison', () => {
    it('should require admin authentication', async () => {
      const response = await request(app)
        .post('/api/analytics/regional-comparison')
        .send({ regionIds: ['region1', 'region2'] });

      expect(response.status).toBe(401);
    });

    it('should get regional comparison with admin auth', async () => {
      const response = await request(app)
        .post('/api/analytics/regional-comparison')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({ regionIds: ['region1', 'region2'] });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .post('/api/analytics/regional-comparison')
        .set('Cookie', [`session=${sellerSessionId}`])
        .send({ regionIds: ['region1', 'region2'] });

      expect(response.status).toBe(403);
    });

    it('should require regionIds array', async () => {
      const response = await request(app)
        .post('/api/analytics/regional-comparison')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should validate regionIds is an array', async () => {
      const response = await request(app)
        .post('/api/analytics/regional-comparison')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({ regionIds: 'not-an-array' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty analytics data', async () => {
      const response = await request(app)
        .get('/api/analytics/demand?category=nonexistent-category')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should handle invalid date formats gracefully', async () => {
      const response = await request(app)
        .get('/api/analytics/demand?startDate=invalid-date')
        .set('Cookie', [`session=${adminSessionId}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });
});
