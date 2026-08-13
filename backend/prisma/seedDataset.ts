import {
  PrismaClient,
  GapPriority,
} from '@prisma/client';

const prisma = new PrismaClient();

// ── Region UUID lookup (Excel int ID → DB UUID) ──────────────────────────────
// Will be populated dynamically from database
let REGION_MAP: Record<number, string> = {};

async function loadRegionMappings() {
  console.log('🔍 Loading region mappings from database...');
  const regions = await prisma.region.findMany();
  
  // Map region names to IDs
  const regionNameToId: Record<string, string> = {};
  regions.forEach(r => {
    regionNameToId[r.name] = r.id;
  });
  
  // Map Excel IDs to database UUIDs based on region names
  REGION_MAP = {
    1: regionNameToId['Andhra Pradesh'],
    2: regionNameToId['Gujarat'],
    3: regionNameToId['Rajasthan'],
    4: regionNameToId['Tamil Nadu'],
    5: regionNameToId['West Bengal'],
  };
  
  console.log('✅ Region mappings loaded:', REGION_MAP);
}

// ── Status mappers ────────────────────────────────────────────────────────────

function mapGapPriority(p: string): GapPriority {
  if (p === 'P0') return GapPriority.HIGH;
  if (p === 'P1') return GapPriority.MEDIUM;
  return GapPriority.LOW;
}

async function clearDatasetTables() {
  console.log('🧹  Clearing previous dataset rows …');
  await prisma.gapResolution.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.sellerAuditLog.deleteMany();
  await prisma.catalogProduct.deleteMany();
  // Clear Excel-sourced demand_signals, catalog_gaps, potential_sellers
  // We do NOT touch regions/festivals/textiles/sellers seeded by seed.ts
  console.log('✅  Tables cleared.');
}

// ── 1. regional_demand → demand_signals ──────────────────────────────────────
async function seedDemandSignals() {
  console.log('📊  Seeding demand signals …');
  const rows = [
    { regionId: 1, category: 'Women', productName: 'Authentic Dharmavaram Saree', monthlySearchVolume: 4196, demandScore: 45, growthPct: 30.66, trend: 'Rising' },
    { regionId: 1, category: 'Men', productName: 'Authentic Kalamkari Shirt', monthlySearchVolume: 6547, demandScore: 58, growthPct: 43.43, trend: 'Surging' },
    { regionId: 5, category: 'Home Decor', productName: 'Authentic Kantha Cushion Cover', monthlySearchVolume: 8701, demandScore: 95, growthPct: 30.01, trend: 'Declining' },
    { regionId: 3, category: 'Home Decor', productName: 'Authentic Dabu Table Runner', monthlySearchVolume: 9160, demandScore: 74, growthPct: 16.58, trend: 'Surging' },
    { regionId: 5, category: 'Men', productName: 'Authentic Santipuri Scarf', monthlySearchVolume: 34979, demandScore: 68, growthPct: 36.57, trend: 'Declining' },
    { regionId: 1, category: 'Home Decor', productName: 'Authentic Venkatagiri Cushion Cover', monthlySearchVolume: 6846, demandScore: 95, growthPct: 39.76, trend: 'Surging' },
    { regionId: 4, category: 'Women', productName: 'Authentic Toda Embroidery Stole', monthlySearchVolume: 10586, demandScore: 91, growthPct: -1.73, trend: 'Rising' },
    { regionId: 1, category: 'Men', productName: 'Authentic Dharmavaram Shirt', monthlySearchVolume: 2583, demandScore: 100, growthPct: 27.3, trend: 'Declining' },
    { regionId: 4, category: 'Accessories', productName: 'Authentic Sungudi Bag', monthlySearchVolume: 5644, demandScore: 73, growthPct: 4.98, trend: 'Surging' },
    { regionId: 3, category: 'Men', productName: 'Authentic Leheriya Jacket', monthlySearchVolume: 502286, demandScore: 76, growthPct: 16.61, trend: 'Rising' },
    { regionId: 1, category: 'Accessories', productName: 'Authentic Mangalagiri Bag', monthlySearchVolume: 36446, demandScore: 62, growthPct: 20.31, trend: 'Surging' },
    { regionId: 2, category: 'Accessories', productName: 'Authentic Bandhani Bag', monthlySearchVolume: 823, demandScore: 90, growthPct: 17.82, trend: 'Surging' },
    { regionId: 1, category: 'Women', productName: 'Authentic Venkatagiri Maxi Dress', monthlySearchVolume: 17686, demandScore: 52, growthPct: 1.7, trend: 'Surging' },
    { regionId: 3, category: 'Women', productName: 'Authentic Kota Doria Stole', monthlySearchVolume: 16870, demandScore: 87, growthPct: 31.78, trend: 'Rising' },
    { regionId: 2, category: 'Men', productName: 'Authentic Tangaliya Kurta', monthlySearchVolume: 1833, demandScore: 94, growthPct: 32.37, trend: 'Rising' },
    { regionId: 3, category: 'Men', productName: 'Authentic Leheriya Kurta', monthlySearchVolume: 32875, demandScore: 91, growthPct: 38.94, trend: 'Rising' },
    { regionId: 4, category: 'Home Decor', productName: 'Authentic Salem Silk Cushion Cover', monthlySearchVolume: 37942, demandScore: 73, growthPct: 20.71, trend: 'Surging' },
    { regionId: 3, category: 'Home Decor', productName: 'Authentic Dabu Bedsheet', monthlySearchVolume: 158706, demandScore: 80, growthPct: 18.32, trend: 'Surging' },
    { regionId: 2, category: 'Accessories', productName: 'Authentic Patola Bag', monthlySearchVolume: 895, demandScore: 53, growthPct: 35.43, trend: 'Declining' },
    { regionId: 4, category: 'Accessories', productName: 'Authentic Salem Silk Jewelry', monthlySearchVolume: 4671, demandScore: 56, growthPct: 11.51, trend: 'Rising' },
    { regionId: 1, category: 'Men', productName: 'Authentic Kalamkari Panjabi', monthlySearchVolume: 10229, demandScore: 76, growthPct: 28.5, trend: 'Stable' },
    { regionId: 2, category: 'Accessories', productName: 'Authentic Bandhani Footwear', monthlySearchVolume: 56798, demandScore: 65, growthPct: 14.11, trend: 'Declining' },
    { regionId: 5, category: 'Women', productName: 'Authentic Baluchari Stole', monthlySearchVolume: 21041, demandScore: 45, growthPct: 29.15, trend: 'Rising' },
    { regionId: 1, category: 'Home Decor', productName: 'Authentic Mangalagiri Cushion Cover', monthlySearchVolume: 1887, demandScore: 46, growthPct: 28.28, trend: 'Rising' },
    { regionId: 1, category: 'Home Decor', productName: 'Authentic Venkatagiri Table Runner', monthlySearchVolume: 6295, demandScore: 71, growthPct: 23.4, trend: 'Declining' },
    { regionId: 3, category: 'Accessories', productName: 'Authentic Bagru Bag', monthlySearchVolume: 14364, demandScore: 59, growthPct: 7.1, trend: 'Declining' },
    { regionId: 1, category: 'Women', productName: 'Authentic Mangalagiri Saree', monthlySearchVolume: 2310, demandScore: 41, growthPct: 22.1, trend: 'Declining' },
    { regionId: 2, category: 'Accessories', productName: 'Authentic Mashru Footwear', monthlySearchVolume: 66252, demandScore: 77, growthPct: 17.63, trend: 'Declining' },
    { regionId: 2, category: 'Home Decor', productName: 'Authentic Tangaliya Cushion Cover', monthlySearchVolume: 1344, demandScore: 49, growthPct: 13.35, trend: 'Rising' },
    { regionId: 3, category: 'Men', productName: 'Authentic Bagru Panjabi', monthlySearchVolume: 4465, demandScore: 67, growthPct: 40.89, trend: 'Rising' },
    { regionId: 3, category: 'Women', productName: 'Authentic Dabu Saree', monthlySearchVolume: 12894, demandScore: 87, growthPct: 16.7, trend: 'Rising' },
    { regionId: 4, category: 'Men', productName: 'Authentic Salem Silk Kurta', monthlySearchVolume: 4341, demandScore: 44, growthPct: -0.39, trend: 'Declining' },
    { regionId: 1, category: 'Accessories', productName: 'Authentic Kalamkari Belt', monthlySearchVolume: 89396, demandScore: 93, growthPct: 44.24, trend: 'Stable' },
    { regionId: 1, category: 'Accessories', productName: 'Authentic Venkatagiri Footwear', monthlySearchVolume: 2631, demandScore: 91, growthPct: 29.5, trend: 'Declining' },
    { regionId: 1, category: 'Accessories', productName: 'Authentic Dharmavaram Footwear', monthlySearchVolume: 360788, demandScore: 71, growthPct: 41.99, trend: 'Declining' },
    { regionId: 1, category: 'Home Decor', productName: 'Authentic Kalamkari Wall Hanging', monthlySearchVolume: 1549, demandScore: 63, growthPct: 31.7, trend: 'Rising' },
    { regionId: 2, category: 'Men', productName: 'Authentic Patola Panjabi', monthlySearchVolume: 122319, demandScore: 50, growthPct: 6.63, trend: 'Rising' },
    { regionId: 4, category: 'Home Decor', productName: 'Authentic Sungudi Wall Hanging', monthlySearchVolume: 663, demandScore: 67, growthPct: 43.15, trend: 'Stable' },
    { regionId: 2, category: 'Accessories', productName: 'Authentic Tangaliya Bag', monthlySearchVolume: 3254, demandScore: 73, growthPct: 35.47, trend: 'Rising' },
    { regionId: 3, category: 'Men', productName: 'Authentic Bagru Scarf', monthlySearchVolume: 417, demandScore: 61, growthPct: 43.5, trend: 'Declining' },
    { regionId: 4, category: 'Home Decor', productName: 'Authentic Toda Embroidery Wall Hanging', monthlySearchVolume: 1625, demandScore: 74, growthPct: 43.11, trend: 'Rising' },
    { regionId: 2, category: 'Accessories', productName: 'Authentic Patola Jewelry', monthlySearchVolume: 44189, demandScore: 92, growthPct: -4.72, trend: 'Declining' },
    { regionId: 3, category: 'Accessories', productName: 'Authentic Kota Doria Bag', monthlySearchVolume: 19966, demandScore: 97, growthPct: 28.94, trend: 'Rising' },
    { regionId: 3, category: 'Women', productName: 'Authentic Sanganeri Saree', monthlySearchVolume: 4461, demandScore: 85, growthPct: 23.07, trend: 'Declining' },
    { regionId: 3, category: 'Home Decor', productName: 'Authentic Kota Doria Table Runner', monthlySearchVolume: 23876, demandScore: 82, growthPct: 3.26, trend: 'Declining' },
    { regionId: 4, category: 'Women', productName: 'Authentic Sungudi Maxi Dress', monthlySearchVolume: 8418, demandScore: 84, growthPct: 31.08, trend: 'Declining' },
    { regionId: 1, category: 'Home Decor', productName: 'Authentic Dharmavaram Cushion Cover', monthlySearchVolume: 6110, demandScore: 100, growthPct: 9.52, trend: 'Rising' },
    { regionId: 2, category: 'Women', productName: 'Authentic Patola Saree', monthlySearchVolume: 2095, demandScore: 98, growthPct: 44.62, trend: 'Surging' },
    { regionId: 2, category: 'Women', productName: 'Authentic Tangaliya Dupatta', monthlySearchVolume: 102348, demandScore: 72, growthPct: 25.35, trend: 'Declining' },
    { regionId: 4, category: 'Men', productName: 'Authentic Kanjeevaram Scarf', monthlySearchVolume: 30560, demandScore: 58, growthPct: 41.88, trend: 'Rising' },
  ];

  const data = rows.map((r) => ({
    regionId: REGION_MAP[r.regionId],
    category: r.category,
    demandScore: r.demandScore,
    seasonality: r.demandScore >= 80 ? 'HIGH' as const : r.demandScore >= 60 ? 'MEDIUM' as const : 'LOW' as const,
    source: 'Excel Dataset',
    period: 'FY2026',
    additionalData: {
      productName: r.productName,
      monthlySearchVolume: r.monthlySearchVolume,
      growthPercentage: r.growthPct,
      trend: r.trend,
    },
  }));

  await prisma.demandSignal.createMany({ data, skipDuplicates: true });
  console.log(`   ✓ ${data.length} demand signals inserted`);
}

// ── 2. catalog_gap → catalog_gaps ────────────────────────────────────────────
async function seedCatalogGaps() {
  console.log('🔍  Seeding catalog gaps …');
  const rows = [
    { id: 1, regionId: 1, productName: 'Authentic Venkatagiri Cushion Cover', demandScore: 95, currentProducts: 0, gapScore: 85, priority: 'P1' },
    { id: 2, regionId: 4, productName: 'Authentic Toda Embroidery Stole', demandScore: 91, currentProducts: 0, gapScore: 84, priority: 'P1' },
    { id: 3, regionId: 1, productName: 'Authentic Dharmavaram Shirt', demandScore: 100, currentProducts: 0, gapScore: 91, priority: 'P0' },
    { id: 4, regionId: 2, productName: 'Authentic Bandhani Bag', demandScore: 90, currentProducts: 2, gapScore: 84, priority: 'P1' },
    { id: 5, regionId: 3, productName: 'Authentic Kota Doria Stole', demandScore: 87, currentProducts: 0, gapScore: 86, priority: 'P1' },
    { id: 6, regionId: 2, productName: 'Authentic Tangaliya Kurta', demandScore: 94, currentProducts: 0, gapScore: 87, priority: 'P1' },
    { id: 7, regionId: 3, productName: 'Authentic Dabu Saree', demandScore: 87, currentProducts: 0, gapScore: 85, priority: 'P1' },
    { id: 8, regionId: 1, productName: 'Authentic Kalamkari Belt', demandScore: 93, currentProducts: 0, gapScore: 91, priority: 'P1' },
    { id: 9, regionId: 2, productName: 'Authentic Patola Jewelry', demandScore: 92, currentProducts: 0, gapScore: 83, priority: 'P1' },
    { id: 10, regionId: 1, productName: 'Authentic Dharmavaram Cushion Cover', demandScore: 100, currentProducts: 2, gapScore: 94, priority: 'P0' },
    { id: 11, regionId: 2, productName: 'Authentic Patola Saree', demandScore: 98, currentProducts: 1, gapScore: 97, priority: 'P0' },
    { id: 12, regionId: 2, productName: 'Authentic Patola Maxi Dress', demandScore: 91, currentProducts: 1, gapScore: 86, priority: 'P1' },
    { id: 13, regionId: 4, productName: 'Authentic Salem Silk Jewelry', demandScore: 91, currentProducts: 0, gapScore: 89, priority: 'P1' },
    { id: 14, regionId: 2, productName: 'Authentic Ajrakh Dhoti', demandScore: 100, currentProducts: 0, gapScore: 91, priority: 'P0' },
    { id: 15, regionId: 1, productName: 'Authentic Mangalagiri Kurta', demandScore: 100, currentProducts: 1, gapScore: 96, priority: 'P0' },
    { id: 16, regionId: 3, productName: 'Authentic Sanganeri Stole', demandScore: 90, currentProducts: 2, gapScore: 82, priority: 'P1' },
    { id: 17, regionId: 1, productName: 'Authentic Kalamkari Cushion Cover', demandScore: 96, currentProducts: 0, gapScore: 90, priority: 'P0' },
    { id: 18, regionId: 5, productName: 'Authentic Garad Jewelry', demandScore: 97, currentProducts: 2, gapScore: 96, priority: 'P0' },
    { id: 19, regionId: 5, productName: 'Authentic Santipuri Table Runner', demandScore: 89, currentProducts: 1, gapScore: 87, priority: 'P1' },
    { id: 20, regionId: 3, productName: 'Authentic Bagru Bag', demandScore: 91, currentProducts: 2, gapScore: 88, priority: 'P1' },
    { id: 21, regionId: 2, productName: 'Authentic Tangaliya Scarf', demandScore: 100, currentProducts: 0, gapScore: 90, priority: 'P0' },
    { id: 22, regionId: 3, productName: 'Authentic Dabu Belt', demandScore: 95, currentProducts: 1, gapScore: 87, priority: 'P1' },
    { id: 23, regionId: 4, productName: 'Authentic Salem Silk Maxi Dress', demandScore: 91, currentProducts: 2, gapScore: 87, priority: 'P1' },
    { id: 24, regionId: 5, productName: 'Authentic Kantha Scarf', demandScore: 99, currentProducts: 2, gapScore: 91, priority: 'P0' },
    { id: 25, regionId: 4, productName: 'Authentic Salem Silk Stole', demandScore: 90, currentProducts: 2, gapScore: 85, priority: 'P1' },
    { id: 26, regionId: 1, productName: 'Authentic Dharmavaram Wall Hanging', demandScore: 90, currentProducts: 1, gapScore: 81, priority: 'P1' },
    { id: 27, regionId: 3, productName: 'Authentic Bagru Bag', demandScore: 88, currentProducts: 2, gapScore: 83, priority: 'P1' },
    { id: 28, regionId: 4, productName: 'Authentic Salem Silk Belt', demandScore: 100, currentProducts: 1, gapScore: 93, priority: 'P0' },
    { id: 29, regionId: 1, productName: 'Authentic Venkatagiri Lehenga', demandScore: 90, currentProducts: 2, gapScore: 88, priority: 'P1' },
    { id: 30, regionId: 5, productName: 'Authentic Garad Kurta', demandScore: 93, currentProducts: 0, gapScore: 92, priority: 'P1' },
    { id: 31, regionId: 1, productName: 'Authentic Mangalagiri Kurti', demandScore: 88, currentProducts: 0, gapScore: 84, priority: 'P1' },
    { id: 32, regionId: 5, productName: 'Authentic Santipuri Stole', demandScore: 100, currentProducts: 0, gapScore: 98, priority: 'P0' },
    { id: 33, regionId: 5, productName: 'Authentic Baluchari Saree', demandScore: 90, currentProducts: 1, gapScore: 88, priority: 'P1' },
    { id: 34, regionId: 1, productName: 'Authentic Venkatagiri Bag', demandScore: 100, currentProducts: 1, gapScore: 97, priority: 'P0' },
    { id: 35, regionId: 5, productName: 'Authentic Kantha Dupatta', demandScore: 91, currentProducts: 1, gapScore: 89, priority: 'P1' },
    { id: 36, regionId: 2, productName: 'Authentic Patola Scarf', demandScore: 95, currentProducts: 1, gapScore: 87, priority: 'P1' },
    { id: 37, regionId: 2, productName: 'Authentic Bandhani Saree', demandScore: 90, currentProducts: 1, gapScore: 86, priority: 'P1' },
    { id: 38, regionId: 5, productName: 'Authentic Kantha Stole', demandScore: 95, currentProducts: 0, gapScore: 85, priority: 'P1' },
    { id: 39, regionId: 5, productName: 'Authentic Jamdani Table Runner', demandScore: 92, currentProducts: 1, gapScore: 91, priority: 'P1' },
    { id: 40, regionId: 2, productName: 'Authentic Mashru Scarf', demandScore: 96, currentProducts: 0, gapScore: 87, priority: 'P0' },
    { id: 41, regionId: 4, productName: 'Authentic Sungudi Shirt', demandScore: 88, currentProducts: 1, gapScore: 84, priority: 'P1' },
    { id: 42, regionId: 4, productName: 'Authentic Sungudi Wall Hanging', demandScore: 97, currentProducts: 1, gapScore: 89, priority: 'P0' },
    { id: 43, regionId: 3, productName: 'Authentic Leheriya Saree', demandScore: 100, currentProducts: 1, gapScore: 98, priority: 'P0' },
    { id: 44, regionId: 1, productName: 'Authentic Kalamkari Wall Hanging', demandScore: 99, currentProducts: 2, gapScore: 90, priority: 'P0' },
    { id: 45, regionId: 4, productName: 'Authentic Salem Silk Dupatta', demandScore: 96, currentProducts: 2, gapScore: 88, priority: 'P0' },
    { id: 46, regionId: 1, productName: 'Authentic Venkatagiri Cushion Cover', demandScore: 97, currentProducts: 1, gapScore: 90, priority: 'P0' },
    { id: 47, regionId: 5, productName: 'Authentic Garad Bag', demandScore: 94, currentProducts: 2, gapScore: 85, priority: 'P1' },
    { id: 48, regionId: 4, productName: 'Authentic Sungudi Scarf', demandScore: 97, currentProducts: 0, gapScore: 90, priority: 'P0' },
    { id: 49, regionId: 4, productName: 'Authentic Salem Silk Bag', demandScore: 93, currentProducts: 0, gapScore: 89, priority: 'P1' },
    { id: 50, regionId: 5, productName: 'Authentic Garad Wall Hanging', demandScore: 98, currentProducts: 0, gapScore: 93, priority: 'P0' },
  ];

  const data = rows.map((r) => ({
    regionId: REGION_MAP[r.regionId],
    category: 'Mixed',
    demand: r.demandScore,
    available: r.currentProducts,
    gap: r.gapScore,
    priority: mapGapPriority(r.priority),
    identifiedAt: new Date('2026-01-01'),
    additionalData: { productName: r.productName, excelId: r.id },
  }));

  await prisma.catalogGap.createMany({ data: data as any, skipDuplicates: true });
  console.log(`   ✓ ${data.length} catalog gaps inserted`);
}

// ── Main execution ───────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🌱 Starting dataset seed...');
    
    await loadRegionMappings();
    await clearDatasetTables();
    await seedDemandSignals();
    await seedCatalogGaps();
    
    console.log('✅ Dataset seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
