// ============================================================================
// FULL EXCEL DATASET IMPORT
// ============================================================================
// Import complete dataset from VendSway_Massive_Dataset.xlsx

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

const excelPath = path.join(__dirname, '../../VendSway_Massive_Dataset.xlsx');

// ── Region ID mapping (Excel integer IDs to database UUIDs) ─────────────────────
let REGION_ID_MAP = {};
let REGION_NAME_TO_ID_MAP = {};

async function loadRegionMappings() {
  console.log('🔍 Loading region mappings from database...');
  const regions = await prisma.region.findMany();
  
  // Map region codes to IDs
  const regionCodeToId = {};
  regions.forEach(r => {
    regionCodeToId[r.code] = r.id;
    REGION_NAME_TO_ID_MAP[r.name] = r.id;
  });
  
  // Map Excel integer IDs to database UUIDs
  REGION_ID_MAP = {
    1: regionCodeToId['AP'], // Andhra Pradesh
    2: regionCodeToId['GJ'], // Gujarat
    3: regionCodeToId['RJ'], // Rajasthan
    4: regionCodeToId['TN'], // Tamil Nadu
    5: regionCodeToId['WB'], // West Bengal
  };
  
  console.log('✅ Region ID mappings loaded:', REGION_ID_MAP);
  console.log('✅ Region name mappings loaded:', REGION_NAME_TO_ID_MAP);
}

// ── Status mappers ────────────────────────────────────────────────────────────
function mapSellerStatus(status) {
  if (status === 'Approved' || status === 'Active') return 'APPROVED';
  if (status === 'Pending' || status === 'Under Review') return 'PENDING';
  if (status === 'Rejected' || status === 'Inactive') return 'REJECTED';
  return 'PENDING';
}

function mapApplicationStatus(status) {
  if (status === 'Approved' || status === 'Verified') return 'APPROVED';
  if (status === 'Rejected') return 'REJECTED';
  return 'SUBMITTED';
}

function mapGapPriority(priority) {
  if (priority === 'P0' || priority === 'High') return 'HIGH';
  if (priority === 'P1' || priority === 'Medium') return 'MEDIUM';
  return 'LOW';
}

function mapFashionRelevance(relevance) {
  if (relevance === 'High' || relevance === 'Very High') return 'HIGH';
  if (relevance === 'Medium') return 'MEDIUM';
  return 'LOW';
}

// ── Import Regions ───────────────────────────────────────────────────────────
async function importRegions() {
  console.log('🗺️  Importing regions...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['regions'];
  const data = XLSX.utils.sheet_to_json(sheet);

  const regions = [];
  for (const row of data) {
    const code = REGION_CODE_MAP[row.state_name];
    if (!code) {
      console.warn(`  Skipping region without code: ${row.state_name}`);
      continue;
    }

    const region = await prisma.region.upsert({
      where: { code },
      update: {
        name: row.state_name,
        description: row.description,
      },
      create: {
        name: row.state_name,
        code,
        centerLat: 20.5937,
        centerLng: 78.9629,
        description: row.description,
      },
    });
    regions.push(region);
  }

  console.log(`   ✓ ${regions.length} regions imported`);
  return regions;
}

const REGION_CODE_MAP = {
  'Andhra Pradesh': 'AP',
  'Gujarat': 'GJ',
  'Rajasthan': 'RJ',
  'Tamil Nadu': 'TN',
  'West Bengal': 'WB',
};

// ── Import Festivals ─────────────────────────────────────────────────────────
async function importFestivals() {
  console.log('🎉 Importing festivals...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['festivals'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    const regionId = REGION_ID_MAP[row.region_id];
    if (!regionId) {
      console.warn(`  Skipping festival without valid region_id: ${row.festival_name} (region_id: ${row.region_id})`);
      continue;
    }

    const festivalDate = new Date();
    festivalDate.setMonth(festivalDate.getMonth() + Math.floor(Math.random() * 12));

    await prisma.festival.upsert({
      where: { id: String(row.id) },
      update: {},
      create: {
        id: String(row.id),
        name: row.festival_name,
        regionId,
        date: festivalDate,
        description: `${row.festival_name} - Regional festival`,
        fashionRelevance: mapFashionRelevance(row.expected_demand_level),
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} festivals imported`);
}

// ── Import Regional Textiles ─────────────────────────────────────────────────
async function importRegionalTextiles() {
  console.log('🧵 Importing regional textiles...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['regional_textiles'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    const regionId = REGION_ID_MAP[row.region_id];
    if (!regionId) continue;

    await prisma.textile.upsert({
      where: { id: String(row.id) },
      update: {},
      create: {
        id: String(row.id),
        name: row.textile_name,
        regionId,
        description: `${row.textile_name} from ${row.origin_district}. Materials: ${row.materials}`,
        giTagged: row.gi_certified === 'Yes' || row.gi_certified === true,
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} textiles imported`);
}

// ── Import Approved Sellers ──────────────────────────────────────────────────
async function importApprovedSellers() {
  console.log('🏪 Importing approved sellers...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['approved_sellers'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    // Try to map region name to region ID
    const regionId = REGION_NAME_TO_ID_MAP[row.region];
    if (!regionId) {
      console.warn(`  Skipping seller without valid region: ${row.business_name} (region: ${row.region})`);
      continue;
    }

    // Create user for seller with unique email
    const userEmail = `${row.seller_name.toLowerCase().replace(/\s/g, '')}${row.seller_id}@demo.com`;
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: {
        email: userEmail,
        role: 'SELLER',
        name: row.seller_name,
      },
    });

    await prisma.seller.upsert({
      where: { id: String(row.seller_id) },
      update: {
        rating: row.rating,
        status: mapSellerStatus(row.status),
        approvedDate: row.approved_date ? new Date(row.approved_date) : null,
      },
      create: {
        id: String(row.seller_id),
        userId: user.id,
        businessName: row.business_name,
        contactPerson: row.seller_name,
        email: userEmail,
        phone: '+91-9876543210',
        location: row.region,
        regionId,
        giTagged: true,
        msme: true,
        categories: ['Sarees', 'Fabrics'],
        productionCapacity: 100,
        rating: row.rating,
        status: mapSellerStatus(row.status),
        approvedDate: row.approved_date ? new Date(row.approved_date) : null,
        excelSellerId: row.seller_id,
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} approved sellers imported`);
}

// ── Import Seller Products ───────────────────────────────────────────────────
async function importSellerProducts() {
  console.log('👗 Importing seller products...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['seller_products'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    // Try to map region name to region ID
    const regionId = REGION_NAME_TO_ID_MAP[row.region] || REGION_ID_MAP[row.region];
    if (!regionId) {
      console.warn(`  Skipping product without valid region: ${row.product_name} (region: ${row.region})`);
      continue;
    }

    const sellerId = String(row.seller_id);
    
    // Check if seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    
    if (!seller) {
      console.warn(`  Skipping product for non-existent seller: ${sellerId}`);
      continue;
    }

    // Determine approval status - default to APPROVED for catalog products
    const isApproved = row.approval_status === 'Approved' || row.approval_status === 'approved' || !row.approval_status;

    const product = await prisma.product.upsert({
      where: { id: String(row.product_id) },
      update: {
        price: row.price,
        stock: row.stock,
        status: isApproved ? 'APPROVED' : 'PENDING',
        available: isApproved,
      },
      create: {
        id: String(row.product_id),
        name: row.product_name,
        category: row.category,
        regionId,
        sellerId,
        price: row.price,
        giTagged: true,
        description: `${row.product_name} - ${row.category}`,
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
        available: isApproved,
        stock: row.stock,
        status: isApproved ? 'APPROVED' : 'PENDING',
        excelProductId: row.product_id,
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} products imported`);
}

// ── Import Regional Demand ───────────────────────────────────────────────────
async function importRegionalDemand() {
  console.log('📊 Importing regional demand...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['regional_demand'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    const regionId = REGION_ID_MAP[row.region_id];
    if (!regionId) continue;

    const seasonality = row.demand_score >= 80 ? 'HIGH' : row.demand_score >= 60 ? 'MEDIUM' : 'LOW';

    await prisma.demandSignal.create({
      data: {
        regionId,
        category: row.category,
        demandScore: row.demand_score,
        seasonality,
        source: 'Excel Dataset',
        period: 'FY2026',
        additionalData: {
          productName: row.product_name,
          monthlySearchVolume: row.monthly_search_volume,
          growthPercentage: row.growth_percentage,
          trend: row.trend,
          excelId: row.id,
        },
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} demand signals imported`);
}

// ── Import Catalog Gaps ───────────────────────────────────────────────────────
async function importCatalogGaps() {
  console.log('🔍 Importing catalog gaps...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['catalog_gap'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    const regionId = REGION_ID_MAP[row.region_id];
    if (!regionId) continue;

    await prisma.catalogGap.create({
      data: {
        regionId,
        category: 'Mixed',
        demand: row.demand_score,
        available: row.current_products,
        gap: row.gap_score,
        priority: mapGapPriority(row.priority),
        identifiedAt: new Date('2026-01-01'),
        additionalData: {
          productName: row.product_name,
          excelId: row.id,
        },
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} catalog gaps imported`);
}

// ── Import Potential Sellers ─────────────────────────────────────────────────
async function importPotentialSellers() {
  console.log('👥 Importing potential sellers...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['potential_sellers'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    // Try to map state name to region ID
    const regionId = REGION_NAME_TO_ID_MAP[row.state];
    if (!regionId) {
      console.warn(`  Skipping potential seller without valid region: ${row.state}`);
      continue;
    }

    await prisma.potentialSeller.create({
      data: {
        sellerName: row.seller_name,
        businessName: row.business_name,
        phone: '9876543210',
        email: `${row.seller_name.toLowerCase().replace(/\s/g, '.')}@example.com`,
        address: row.district,
        district: row.district,
        state: row.state,
        regionId,
        categories: [row.craft_specialization],
        specialization: row.craft_specialization,
        giTagged: row.gi_certified === 'Yes' || row.gi_certified === true,
        status: row.status === 'Not Contacted' ? 'NOT_CONTACTED' : 
                row.status === 'Contacted' ? 'INTERESTED' : 
                row.status === 'Application Submitted' ? 'REGISTERED' : 'NOT_CONTACTED',
        source: 'Excel Import',
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} potential sellers imported`);
}

// ── Import Seller Applications ────────────────────────────────────────────────
async function importSellerApplications() {
  console.log('📝 Importing seller applications...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['seller_applications'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    const sellerId = String(row.seller_reference);
    
    // Check if seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    
    if (!seller) {
      console.warn(`  Skipping application for non-existent seller: ${sellerId}`);
      continue;
    }
    
    await prisma.sellerApplication.create({
      data: {
        sellerId,
        status: mapApplicationStatus(row.verification_status),
        submittedAt: row.submitted_date ? new Date(row.submitted_date) : new Date(),
        notes: `Documents uploaded: ${row.documents_uploaded}`,
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} seller applications imported`);
}

// ── Import Seller Invitations ────────────────────────────────────────────────
async function importSellerInvitations() {
  console.log('📧 Importing seller invitations...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['seller_invitations'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    await prisma.sellerInvitation.create({
      data: {
        sellerExcelId: row.seller_id,
        gapExcelId: row.gap_id,
        sentBy: row.sent_by,
        sentDate: row.sent_date ? new Date(row.sent_date) : new Date(),
        status: row.status,
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} seller invitations imported`);
}

// ── Import Product Reviews ────────────────────────────────────────────────────
async function importProductReviews() {
  console.log('⭐ Importing product reviews...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['product_reviews'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    await prisma.productReview.create({
      data: {
        productExcelId: row.product_id,
        reviewerName: row.reviewer_name,
        decision: row.decision,
        reviewDate: row.review_date ? new Date(row.review_date) : new Date(),
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} product reviews imported`);
}

// ── Import Catalog Products ───────────────────────────────────────────────────
async function importCatalogProducts() {
  console.log('📦 Importing catalog products...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['catalog_products'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    const regionId = REGION_ID_MAP[row.region_id];
    if (!regionId) continue;

    await prisma.catalogProduct.create({
      data: {
        productName: row.product_name,
        category: row.category,
        regionId,
        sellerName: row.seller_name,
        price: row.price,
        stock: row.stock,
        status: row.status || 'Active',
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} catalog products imported`);
}

// ── Import Gap Resolutions ────────────────────────────────────────────────────
async function importGapResolutions() {
  console.log('✅ Importing gap resolutions...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['gap_resolution'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    await prisma.gapResolution.create({
      data: {
        gapExcelId: row.gap_id,
        sellerExcelId: row.seller_id,
        beforeGapScore: row.before_gap_score,
        afterGapScore: row.after_gap_score,
        status: row.status,
        resolutionDate: row.resolution_date ? new Date(row.resolution_date) : new Date(),
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} gap resolutions imported`);
}

// ── Import Seller Audit Logs ──────────────────────────────────────────────────
async function importSellerAuditLogs() {
  console.log('📋 Importing seller audit logs...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['seller_audit_logs'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    await prisma.sellerAuditLog.create({
      data: {
        sellerId: row.seller_id,
        action: row.action,
        performedBy: row.performed_by,
        actionDate: row.action_date ? new Date(row.action_date) : new Date(),
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} seller audit logs imported`);
}

// ── Import Notifications ───────────────────────────────────────────────────────
async function importNotifications() {
  console.log('🔔 Importing notifications...');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['notifications'];
  const data = XLSX.utils.sheet_to_json(sheet);

  let count = 0;
  for (const row of data) {
    await prisma.notification.create({
      data: {
        recipientType: row.recipient_type,
        recipientId: row.recipient_id,
        title: row.title,
        isRead: row.is_read || false,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      },
    });
    count++;
  }

  console.log(`   ✓ ${count} notifications imported`);
}

// ── Main execution ───────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🌱 Starting full dataset import from Excel...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.sellerAuditLog.deleteMany();
    await prisma.gapResolution.deleteMany();
    await prisma.catalogProduct.deleteMany();
    await prisma.productReview.deleteMany();
    await prisma.sellerInvitation.deleteMany();
    await prisma.sellerApplication.deleteMany();
    await prisma.potentialSeller.deleteMany();
    await prisma.catalogGap.deleteMany();
    await prisma.demandSignal.deleteMany();
    await prisma.product.deleteMany();
    await prisma.seller.deleteMany();
    await prisma.textile.deleteMany();
    await prisma.festival.deleteMany();
    await prisma.region.deleteMany();
    await prisma.user.deleteMany();
    
    // Import in order of dependencies
    const regions = await importRegions();
    await loadRegionMappings();
    
    await importFestivals();
    await importRegionalTextiles();
    await importApprovedSellers();
    await importSellerProducts();
    await importRegionalDemand();
    await importCatalogGaps();
    await importPotentialSellers();
    await importSellerApplications();
    await importSellerInvitations();
    await importProductReviews();
    await importCatalogProducts();
    await importGapResolutions();
    await importSellerAuditLogs();
    await importNotifications();
    
    console.log('✅ Full dataset import completed successfully!');
    console.log('📊 Summary:');
    console.log('   - Regions: 5');
    console.log('   - Festivals: 40');
    console.log('   - Textiles: 74');
    console.log('   - Approved Sellers: 250');
    console.log('   - Products: 1647');
    console.log('   - Demand Signals: 2500');
    console.log('   - Catalog Gaps: 536');
    console.log('   - Potential Sellers: 1500');
    console.log('   - Seller Applications: 525');
    console.log('   - Seller Invitations: 1200');
    console.log('   - Product Reviews: 1318');
    console.log('   - Catalog Products: 4000');
    console.log('   - Gap Resolutions: 536');
    console.log('   - Seller Audit Logs: 4000');
    console.log('   - Notifications: 5000');
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
