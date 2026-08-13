import request from 'supertest';
import { createApp } from '../app';

describe('Regional Intelligence API', () => {
  let app: any;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /api/intelligence/regions', () => {
    it('should return all regions', async () => {
      const response = await request(app)
        .get('/api/intelligence/regions');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return regions with correct structure', async () => {
      const response = await request(app)
        .get('/api/intelligence/regions');

      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('id');
        expect(response.body.data[0]).toHaveProperty('name');
        expect(response.body.data[0]).toHaveProperty('code');
      }
    });
  });

  describe('GET /api/intelligence/regions/:id', () => {
    it('should return region details for valid ID', async () => {
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');

      if (regionsResponse.body.data.length > 0) {
        const regionId = regionsResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/intelligence/regions/${regionId}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.id).toBe(regionId);
      }
    });

    it('should return 404 for invalid region ID', async () => {
      const response = await request(app)
        .get('/api/intelligence/regions/invalid-uuid');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/intelligence/regions/:id/textiles', () => {
    it('should return textiles for a region', async () => {
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');

      if (regionsResponse.body.data.length > 0) {
        const regionId = regionsResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/intelligence/regions/${regionId}/textiles`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });

  describe('GET /api/intelligence/regions/:id/festivals', () => {
    it('should return festivals for a region', async () => {
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');

      if (regionsResponse.body.data.length > 0) {
        const regionId = regionsResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/intelligence/regions/${regionId}/festivals`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });

  describe('GET /api/intelligence/regions/:id/gi-products', () => {
    it('should return GI products for a region', async () => {
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');

      if (regionsResponse.body.data.length > 0) {
        const regionId = regionsResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/intelligence/regions/${regionId}/gi-products`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });

  describe('GET /api/intelligence/regions/:id/trends', () => {
    it('should return trends for a region', async () => {
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');

      if (regionsResponse.body.data.length > 0) {
        const regionId = regionsResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/intelligence/regions/${regionId}/trends`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
      }
    });
  });

  describe('GET /api/intelligence/search', () => {
    it('should search regions with query', async () => {
      const response = await request(app)
        .get('/api/intelligence/search?q=test');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should require query parameter', async () => {
      const response = await request(app)
        .get('/api/intelligence/search');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/intelligence/regions/:id/summary', () => {
    it('should return regional summary', async () => {
      const regionsResponse = await request(app)
        .get('/api/intelligence/regions');

      if (regionsResponse.body.data.length > 0) {
        const regionId = regionsResponse.body.data[0].id;

        const response = await request(app)
          .get(`/api/intelligence/regions/${regionId}/summary`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('region');
        expect(response.body.data).toHaveProperty('textiles');
        expect(response.body.data).toHaveProperty('festivals');
        expect(response.body.data).toHaveProperty('giProducts');
        expect(response.body.data).toHaveProperty('trends');
      }
    });
  });
});
