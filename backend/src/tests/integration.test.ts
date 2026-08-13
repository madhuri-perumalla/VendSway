import request from 'supertest';
import { createApp } from '../app';

describe('Integration Tests', () => {
  let app: any;
  let adminSessionId: string;
  let sellerSessionId: string;

  beforeAll(async () => {
    app = createApp();
    
    // Setup sessions for different roles
    const adminAuthResponse = await request(app)
      .post('/api/auth/select-role')
      .send({ role: 'ADMIN' });
    adminSessionId = adminAuthResponse.body.data.sessionId;

    const sellerAuthResponse = await request(app)
      .post('/api/auth/select-role')
      .send({ role: 'SELLER' });
    sellerSessionId = sellerAuthResponse.body.data.sessionId;
  });

  describe('Complete Workflow: Regional Intelligence to Demand to Gaps', () => {
    it('should complete the full regional intelligence workflow', async () => {
      // Step 1: Get regions
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');
      
      expect(regionsResponse.status).toBe(200);
      expect(regionsResponse.body.data.length).toBeGreaterThan(0);

      const regionId = regionsResponse.body.data[0].id;

      // Step 2: Get region details
      const regionDetailsResponse = await request(app)
        .get(`/api/intelligence/regions/${regionId}`);
      
      expect(regionDetailsResponse.status).toBe(200);
      expect(regionDetailsResponse.body.data.id).toBe(regionId);

      // Step 3: Calculate demand for the region
      const demandResponse = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({
          regionId,
          category: 'sarees',
        });
      
      expect(demandResponse.status).toBe(200);
      expect(demandResponse.body.data).toHaveProperty('demandScore');

      // Step 4: Detect gaps for the region
      const gapResponse = await request(app)
        .post('/api/gaps/detect')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({ regionId });
      
      expect(gapResponse.status).toBe(200);
      expect(Array.isArray(gapResponse.body.data)).toBe(true);
    });
  });

  describe('Complete Workflow: Seller Discovery to Onboarding', () => {
    it('should complete the seller discovery and onboarding workflow', async () => {
      // Step 1: Find matching sellers for a gap
      const matchResponse = await request(app)
        .post('/api/sellers/match')
        .send({
          regionId: 'test-region-id',
          category: 'sarees',
        });
      
      expect(matchResponse.status).toBe(200);
      expect(matchResponse.body.data).toHaveProperty('matches');

      // Step 2: Get seller statistics (admin only)
      const statsResponse = await request(app)
        .get('/api/sellers/statistics')
        .set('Cookie', [`session=${adminSessionId}`]);
      
      expect(statsResponse.status).toBe(200);
      expect(statsResponse.body.data).toHaveProperty('totalSellers');
    });
  });

  describe('Complete Workflow: Analytics Dashboard', () => {
    it('should complete the analytics dashboard workflow', async () => {
      // Step 1: Get demand analytics
      const demandAnalyticsResponse = await request(app)
        .get('/api/analytics/demand')
        .set('Cookie', [`session=${adminSessionId}`]);
      
      expect(demandAnalyticsResponse.status).toBe(200);
      expect(demandAnalyticsResponse.body.data).toHaveProperty('summary');

      // Step 2: Get gap analytics
      const gapAnalyticsResponse = await request(app)
        .get('/api/analytics/gaps')
        .set('Cookie', [`session=${adminSessionId}`]);
      
      expect(gapAnalyticsResponse.status).toBe(200);
      expect(gapAnalyticsResponse.body.data).toHaveProperty('summary');

      // Step 3: Get seller analytics
      const sellerAnalyticsResponse = await request(app)
        .get('/api/analytics/sellers')
        .set('Cookie', [`session=${adminSessionId}`]);
      
      expect(sellerAnalyticsResponse.status).toBe(200);
      expect(sellerAnalyticsResponse.body.data).toHaveProperty('summary');

      // Step 4: Get dashboard overview
      const dashboardResponse = await request(app)
        .get('/api/analytics/dashboard')
        .set('Cookie', [`session=${adminSessionId}`]);
      
      expect(dashboardResponse.status).toBe(200);
      expect(dashboardResponse.body.data).toHaveProperty('demand');
      expect(dashboardResponse.body.data).toHaveProperty('gaps');
      expect(dashboardResponse.body.data).toHaveProperty('sellers');
      expect(dashboardResponse.body.data).toHaveProperty('trends');
    });
  });

  describe('Cross-Module Integration: Search and Discovery', () => {
    it('should integrate search across modules', async () => {
      const query = 'saree';

      // Search in regional intelligence
      const regionSearchResponse = await request(app)
        .get(`/api/intelligence/search?q=${query}`);
      
      expect(regionSearchResponse.status).toBe(200);

      // Search in storefront
      const storefrontSearchResponse = await request(app)
        .get(`/api/storefront/search/test-region-id?q=${query}`);
      
      expect(storefrontSearchResponse.status).toBe(200);
      expect(storefrontSearchResponse.body.data).toHaveProperty('products');
      expect(storefrontSearchResponse.body.data).toHaveProperty('sellers');

      // Search in sellers
      const sellerSearchResponse = await request(app)
        .get(`/api/sellers/search?q=${query}`);
      
      expect(sellerSearchResponse.status).toBe(200);
      expect(Array.isArray(sellerSearchResponse.body.data)).toBe(true);
    });
  });

  describe('Authentication Integration Across Modules', () => {
    it('should enforce authentication consistently across protected endpoints', async () => {
      // Test demand endpoints
      const demandResponse = await request(app)
        .post('/api/demand/calculate')
        .send({ regionId: 'test', category: 'test' });
      expect(demandResponse.status).toBe(401);

      // Test gap endpoints
      const gapResponse = await request(app)
        .post('/api/gaps/calculate')
        .send({ regionId: 'test', category: 'test' });
      expect(gapResponse.status).toBe(401);

      // Test analytics endpoints
      const analyticsResponse = await request(app)
        .get('/api/analytics/dashboard');
      expect(analyticsResponse.status).toBe(401);

      // Test seller statistics endpoint
      const sellerStatsResponse = await request(app)
        .get('/api/sellers/statistics');
      expect(sellerStatsResponse.status).toBe(401);
    });

    it('should enforce role-based access consistently', async () => {
      // Test that seller cannot access admin endpoints
      const demandResponse = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${sellerSessionId}`])
        .send({ regionId: 'test', category: 'test' });
      expect(demandResponse.status).toBe(403);

      const analyticsResponse = await request(app)
        .get('/api/analytics/dashboard')
        .set('Cookie', [`session=${sellerSessionId}`]);
      expect(analyticsResponse.status).toBe(403);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid UUIDs consistently across endpoints', async () => {
      const invalidId = 'invalid-uuid';

      // Test regional intelligence
      const regionResponse = await request(app)
        .get(`/api/intelligence/regions/${invalidId}`);
      expect(regionResponse.status).toBe(404);

      // Test demand analysis
      const demandResponse = await request(app)
        .get(`/api/demand/analysis/${invalidId}`)
        .set('Cookie', [`session=${adminSessionId}`]);
      expect(demandResponse.status).toBe(200); // May return empty results

      // Test gap analysis
      const gapResponse = await request(app)
        .get(`/api/gaps/analysis/${invalidId}`)
        .set('Cookie', [`session=${adminSessionId}`]);
      expect(gapResponse.status).toBe(200); // May return empty results
    });

    it('should handle missing required parameters consistently', async () => {
      // Test demand calculation
      const demandResponse = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({});
      expect(demandResponse.status).toBe(400);

      // Test gap calculation
      const gapResponse = await request(app)
        .post('/api/gaps/calculate')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({});
      expect(gapResponse.status).toBe(400);

      // Test seller matching
      const sellerResponse = await request(app)
        .post('/api/sellers/match')
        .send({});
      expect(sellerResponse.status).toBe(400);
    });
  });

  describe('Response Format Consistency', () => {
    it('should return consistent response format across all endpoints', async () => {
      // Test successful responses
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');
      
      expect(regionsResponse.body).toHaveProperty('status');
      expect(regionsResponse.body).toHaveProperty('data');
      expect(regionsResponse.body.status).toBe('success');

      // Test error responses
      const errorResponse = await request(app)
        .post('/api/demand/calculate')
        .set('Cookie', [`session=${adminSessionId}`])
        .send({});
      
      expect(errorResponse.body).toHaveProperty('status');
      expect(errorResponse.body).toHaveProperty('message');
      expect(errorResponse.body.status).toBe('error');
    });
  });
});
