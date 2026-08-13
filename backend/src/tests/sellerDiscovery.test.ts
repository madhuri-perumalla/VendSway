import { SellerMatchingService } from '../services/SellerMatchingService';

describe('Seller discovery business logic', () => {
  it('prioritizes sellers that match the gap category and GI profile', async () => {
    const sellerRepository = {
      getSellersByRegionAndCategory: async () => [
        {
          id: 's1',
          regionId: 'r1',
          categories: ['sarees'],
          giTagged: true,
          productionCapacity: 500,
          rating: 4.8,
          status: 'APPROVED',
        },
        {
          id: 's2',
          regionId: 'r1',
          categories: ['fabrics'],
          giTagged: false,
          productionCapacity: 500,
          rating: 4.8,
          status: 'APPROVED',
        },
      ],
      getSellersByCategory: async () => [],
      getSellersByRegion: async () => [],
      getSellersByGIProduct: async () => [],
    };

    const gapRepository = {
      getUnresolvedGaps: async () => [],
    };

    const service = new SellerMatchingService(sellerRepository as any, gapRepository as any);
    const matches = await service.findMatchingSellers('r1', 'sarees', undefined, 5);

    expect(matches[0].seller.id).toBe('s1');
    expect(matches[0].matchScore).toBeGreaterThan(matches[1].matchScore);
  });
});
