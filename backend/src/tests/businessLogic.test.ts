import { AnalyticsService } from '../services/AnalyticsService';

describe('Analytics business logic', () => {
  it('returns richer KPI and comparison data for the dashboard overview', async () => {
    const demandRepository = {
      getDemandSignalsByRegions: async () => [
        { id: 'd1', regionId: 'r1', category: 'sarees', demandScore: 80, period: '2026-07', createdAt: new Date() },
      ],
    };

    const gapRepository = {
      getGapsByRegion: async () => [
        { id: 'g1', regionId: 'r1', category: 'sarees', gap: 120, priority: 'HIGH', identifiedAt: new Date() },
      ],
      getUnresolvedGaps: async () => [
        { id: 'g1', regionId: 'r1', category: 'sarees', gap: 120, priority: 'HIGH', identifiedAt: new Date() },
      ],
    };

    const sellerRepository = {
      findAll: async () => [
        { id: 's1', regionId: 'r1', status: 'APPROVED', rating: 4.8, createdAt: new Date() },
        { id: 's2', regionId: 'r1', status: 'PENDING', rating: 3.5, createdAt: new Date() },
      ],
      getSellersByRegion: async () => [
        { id: 's1', regionId: 'r1', status: 'APPROVED', rating: 4.8, createdAt: new Date() },
      ],
    };

    const productRepository = {
      getProductCountBySeller: async () => 2,
    };

    const service = new AnalyticsService(
      demandRepository as any,
      gapRepository as any,
      sellerRepository as any,
      productRepository as any
    );

    const overview = await service.getDashboardOverview();

    expect(overview.kpis).toBeDefined();
    expect(overview.kpis.approvedSellers).toBe(1);
    expect(overview.kpis.approvedProducts).toBe(2);
    expect(overview.kpis.catalogCoverage).toBeGreaterThanOrEqual(0);
    expect(overview.kpis.gapReduction).toBeGreaterThanOrEqual(0);
    expect(overview.regionComparison).toBeDefined();
  });
});
