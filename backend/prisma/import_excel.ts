import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

function val(row: any, keys: string[]) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k];
  }
  return null;
}

function toBool(v: any) {
  if (v === true || v === 'true' || v === 'TRUE' || v === 'Yes' || v === 'yes') return true;
  if (v === false || v === 'false' || v === 'FALSE' || v === 'No' || v === 'no') return false;
  return Boolean(v);
}

async function main() {
  console.log('📥 Importing Excel dataset into database...');
  const workbookPath = path.resolve(__dirname, '..', '..', 'VendSway_Massive_Dataset.xlsx');
  const wb = XLSX.readFile(workbookPath);

  const sheetRows: Record<string, any[]> = {};
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    sheetRows[name] = XLSX.utils.sheet_to_json(ws, { defval: null });
    console.log(`  - Found sheet ${name} (${sheetRows[name].length} rows)`);
  }

  console.log('🧹 Clearing existing data (this preserves schema)...');
  // Delete in order to respect FK constraints
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.regionalCollectionProduct.deleteMany();
  await prisma.regionalCollection.deleteMany();
  await prisma.productTextile.deleteMany();
  await prisma.catalogGap.deleteMany();
  await prisma.demandSignal.deleteMany();
  await prisma.catalogItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.sellerApplication.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.regionalTrend.deleteMany();
  await prisma.gIProduct.deleteMany();
  await prisma.textile.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.region.deleteMany();
  await prisma.user.deleteMany();
  await prisma.potentialSeller.deleteMany();
  await prisma.catalogProduct.deleteMany();
  await prisma.sellerAuditLog.deleteMany();
  await prisma.notification.deleteMany();
  // new tables
  // @ts-ignore
  if ((prisma as any).productReview) await (prisma as any).productReview.deleteMany();
  if ((prisma as any).sellerInvitation) await (prisma as any).sellerInvitation.deleteMany();
  if ((prisma as any).gapResolution) await (prisma as any).gapResolution.deleteMany();

  console.log('✅ Cleared existing rows. Proceeding with import...');

  // Helper maps from Excel numeric ids -> prisma uuids
  const regionMap = new Map<number, string>();
  const sellerMap = new Map<number, string>();
  const potentialSellerMap = new Map<number, string>();
  const productMap = new Map<number, string>();

  // 1) Regions
  const regions = sheetRows['regions'] || sheetRows['Regions'] || [];
  for (const r of regions) {
    const excelId = r['id'] ?? r['region_id'] ?? r['regionId'] ?? null;
    const name = val(r, ['state_name', 'name', 'region_name', 'state']) || 'Unknown Region';
    const code = val(r, ['state_code', 'code']) || undefined;
    const description = val(r, ['description', 'desc']) || undefined;
    const centerLat = parseFloat(val(r, ['center_lat', 'centerLat']) || 0) || 0;
    const centerLng = parseFloat(val(r, ['center_lng', 'centerLng']) || 0) || 0;

    const created = await prisma.region.create({
      data: {
        name: String(name),
        code: code ? String(code) : (`R_${Math.random().toString(36).slice(2,8)}`).toUpperCase(),
        description: description ? String(description) : undefined,
        centerLat: centerLat || 0,
        centerLng: centerLng || 0,
      },
    });
    if (excelId != null) regionMap.set(Number(excelId), created.id);
  }

  // 2) Textiles (regional_textiles)
  const textiles = sheetRows['regional_textiles'] || sheetRows['Regional_Textiles'] || [];
  for (const t of textiles) {
    const excelRegionId = t['region_id'] ?? t['state_id'] ?? null;
    const regionId = excelRegionId != null ? regionMap.get(Number(excelRegionId)) : undefined;
    const name = val(t, ['textile_name', 'name']) || 'Unknown Textile';
    const giTagged = toBool(val(t, ['gi_tagged', 'gi_tagged?','giTagged'])) || false;
    const description = val(t, ['materials','description','origin_district']) || undefined;
    await prisma.textile.create({
      data: {
        name: String(name),
        regionId: regionId ?? undefined,
        description: description ? String(description) : undefined,
        giTagged: giTagged,
      },
    });
  }

  // 3) Festivals
  const festivals = sheetRows['festivals'] || [];
  for (const f of festivals) {
    const excelRegionId = f['region_id'] ?? f['state_id'] ?? null;
    const regionId = excelRegionId != null ? regionMap.get(Number(excelRegionId)) : undefined;
    const name = val(f, ['festival_name', 'name']) || 'Festival';
    const dateVal = val(f, ['date', 'festival_date', 'expected_date']) || null;
    const date = dateVal ? new Date(dateVal) : new Date();
    const relevance = 'HIGH';
    await prisma.festival.create({
      data: {
        name: String(name),
        regionId: regionId ?? '', // prisma requires regionId: ensure cascade - if missing set to first region
        date: date,
        description: undefined,
        fashionRelevance: 'HIGH',
      },
    });
  }

  // 4) Potential Sellers
  const potentialSellers = sheetRows['potential_sellers'] || [];
  for (const ps of potentialSellers) {
    const excelId = ps['id'] ?? null;
    const sellerName = val(ps, ['seller_name','sellerName']) || 'Unknown';
    const businessName = val(ps, ['business_name','businessName']) || sellerName;
    const state = val(ps, ['state', 'state_name']);
    // find region by state name
    let regionId: string | undefined = undefined;
    if (state) {
      const found = await prisma.region.findFirst({ where: { name: String(state) } });
      if (found) regionId = found.id;
    }
    const categories = val(ps, ['categories','craft_specialization','specialization']) ? [String(val(ps, ['categories','craft_specialization','specialization']))] : [];
    // resolve fallback region id for potential seller
    let psRegionId = regionId;
    if (!psRegionId) {
      const first = await prisma.region.findFirst();
      psRegionId = first?.id;
    }

    const created = await prisma.potentialSeller.create({
      data: {
        sellerName: String(sellerName),
        businessName: String(businessName),
        phone: val(ps, ['phone','contact']) ?? '',
        email: val(ps, ['email']) ?? '',
        address: val(ps, ['address']) ?? undefined,
        district: val(ps, ['district']) ?? undefined,
        state: state ? String(state) : undefined,
        regionId: psRegionId ?? undefined,
        categories: categories,
        specialization: val(ps, ['craft_specialization','specialization']) ?? undefined,
        giTagged: toBool(val(ps, ['gi_certified','gi_tagged'])) || false,
        msme: toBool(val(ps, ['msme'])) || false,
        msmeNumber: val(ps, ['msme_number']) ?? undefined,
        description: val(ps, ['description']) ?? undefined,
        notes: val(ps, ['notes']) ?? undefined,
        source: 'excel_import',
      },
    });
    if (excelId != null) potentialSellerMap.set(Number(excelId), created.id);
  }

  // 5) Approved Sellers
  const approved = sheetRows['approved_sellers'] || [];
  for (const s of approved) {
    const excelSellerId = s['seller_id'] ?? s['id'] ?? null;
    const businessName = val(s, ['business_name','businessName','seller_name']) || 'Seller';
    const contactPerson = val(s, ['seller_name','contact_person']) || undefined;
    const email = val(s, ['email']) ?? undefined;
    const phone = val(s, ['phone']) ?? undefined;
    const regionName = val(s, ['region','state_name']) ?? undefined;
    let regionId: string | undefined = undefined;
    if (regionName) {
      const found = await prisma.region.findFirst({ where: { name: String(regionName) } });
      if (found) regionId = found.id;
    }
    const giTagged = toBool(val(s, ['gi_tagged'])) || false;
    const msme = toBool(val(s, ['msme'])) || false;
    const categories = val(s, ['categories']) ? String(val(s, ['categories'])).split(',').map((c: string) => c.trim()) : [];
    const rating = Number(val(s, ['rating']) ?? 0) || 0;
    const approvedDate = val(s, ['approved_date', 'approvedDate']) ? new Date(val(s, ['approved_date', 'approvedDate'])) : undefined;
    const statusRaw = String(val(s, ['status']) || '').toLowerCase();
    const status = statusRaw.includes('active') || statusRaw.includes('approved') ? 'APPROVED' : 'PENDING';
    const created = await prisma.seller.create({
      data: {
        excelSellerId: excelSellerId != null ? Number(excelSellerId) : undefined,
        businessName: String(businessName),
        contactPerson: contactPerson ? String(contactPerson) : 'Unknown',
        email: email ? String(email) : `seller_${Math.random().toString(36).slice(2,8)}@example.com`,
        phone: phone ? String(phone) : '',
        location: val(s, ['location']) ?? String(businessName),
        regionId: regionId ?? undefined,
        giTagged: giTagged,
        msme: msme,
        msmeNumber: val(s, ['msme_number']) ?? undefined,
        categories: categories,
        productionCapacity: Number(val(s, ['production_capacity']) ?? 0) || 0,
        rating: rating || 0,
        status: status as any,
        approvedDate: approvedDate,
      },
    });
    if (excelSellerId != null) sellerMap.set(Number(excelSellerId), created.id);
  }

  // 6) Seller Products
  const sellerProducts = sheetRows['seller_products'] || [];
  for (const p of sellerProducts) {
    const excelProductId = p['product_id'] ?? null;
    const excelSellerId = p['seller_id'] ?? null;
    const sellerId = excelSellerId != null ? sellerMap.get(Number(excelSellerId)) : undefined;
    const name = val(p, ['product_name','name']) || 'Product';
    const category = val(p, ['category']) || 'General';
    const price = Number(val(p, ['price']) ?? 0) || 0;
    const stock = Number(val(p, ['stock']) ?? 0) || 0;
    const available = (String(val(p, ['approval_status']) || '').toLowerCase() !== 'rejected');

    // Resolve fallback sellerId if mapping not available
    const fallbackSeller = (await prisma.seller.findFirst())?.id;
    const sellerIdResolved = sellerId ?? fallbackSeller ?? undefined;

    const created = await prisma.product.create({
      data: {
        excelProductId: excelProductId != null ? Number(excelProductId) : undefined,
        name: String(name),
        category: String(category),
        regionId: undefined,
        sellerId: sellerIdResolved,
        price: price,
        giTagged: false,
        description: val(p, ['description']) ?? undefined,
        imageUrl: undefined,
        available: available,
        stock: stock,
        status: 'PENDING',
      },
    });
    if (excelProductId != null) productMap.set(Number(excelProductId), created.id);
  }

  // 7) Catalog Products
  const catalogProducts = sheetRows['catalog_products'] || [];
  for (const cp of catalogProducts) {
    await prisma.catalogProduct.create({
      data: {
        productName: String(val(cp, ['product_name','productName']) || 'Catalog Product'),
        category: String(val(cp, ['category']) || 'General'),
        regionId: cp['region_id'] != null ? regionMap.get(Number(cp['region_id'])) : undefined,
        sellerName: val(cp, ['seller_name']) ?? undefined,
        price: Number(val(cp, ['price']) ?? 0) || 0,
        stock: Number(val(cp, ['stock']) ?? 0) || 0,
        status: val(cp, ['status']) ?? 'Active',
      },
    });
  }

  // 8) Regional Demand -> DemandSignal
  const regionalDemand = sheetRows['regional_demand'] || [];
  for (const d of regionalDemand) {
    const excelId = d['id'] ?? null;
    const excelRegionId = d['region_id'] ?? null;

    let dsRegionId: string | undefined = undefined;
    if (excelRegionId != null) {
      dsRegionId = regionMap.get(Number(excelRegionId)) || undefined;
    }
    if (!dsRegionId) {
      const firstRegion = await prisma.region.findFirst();
      dsRegionId = firstRegion?.id;
    }

    await prisma.demandSignal.create({
      data: {
        excelId: excelId != null ? Number(excelId) : undefined,
        regionId: dsRegionId ?? undefined,
        category: String(val(d, ['category']) || 'General'),
        festivalId: undefined,
        demandScore: Number(val(d, ['demand_score','demandScore']) ?? val(d, ['demand_score']) ?? 0) || 0,
        seasonality: 'MEDIUM',
        source: 'excel_import',
        period: val(d, ['period']) ?? 'unknown',
        additionalData: {
          productName: val(d, ['product_name']) ?? undefined,
          monthlySearchVolume: val(d, ['monthly_search_volume']) ?? undefined,
          trend: val(d, ['trend']) ?? undefined,
          growthPercentage: val(d, ['growth_percentage']) ?? undefined,
        },
      },
    });
  }

  // 9) Catalog Gaps
  const catalogGaps = sheetRows['catalog_gap'] || [];
  for (const g of catalogGaps) {
    const excelId = g['id'] ?? null;
    const excelRegionId = g['region_id'] ?? null;
    const priorityRaw = String(val(g, ['priority']) || '').toUpperCase();
    let priority: any = 'MEDIUM';
    if (priorityRaw.includes('P1') || priorityRaw.includes('HIGH')) priority = 'HIGH';
    if (priorityRaw.includes('P0') || priorityRaw.includes('LOW')) priority = 'LOW';

    await prisma.catalogGap.create({
      data: {
        excelId: excelId != null ? Number(excelId) : undefined,
        regionId: excelRegionId != null ? regionMap.get(Number(excelRegionId)) || undefined : undefined,
        category: String(val(g, ['category']) || 'General'),
        productName: val(g, ['product_name']) ?? undefined,
        demand: Number(val(g, ['demand_score','demand']) ?? 0) || 0,
        available: Number(val(g, ['current_products','available']) ?? 0) || 0,
        gap: Number(val(g, ['gap_score','gap']) ?? val(g, ['gap']) ?? 0) || 0,
        priority: priority,
        identifiedAt: val(g, ['identified_at']) ? new Date(val(g, ['identified_at'])) : new Date(),
      },
    });
  }

  // 10) Gap Resolutions
  const gapRes = sheetRows['gap_resolution'] || [];
  for (const gr of gapRes) {
    await prisma.gapResolution.create({
      data: {
        gapExcelId: Number(val(gr, ['gap_id','gapId']) ?? 0),
        sellerExcelId: Number(val(gr, ['seller_id','sellerId']) ?? 0),
        beforeGapScore: Number(val(gr, ['before_gap_score']) ?? 0),
        afterGapScore: Number(val(gr, ['after_gap_score']) ?? 0),
        status: val(gr, ['status']) ?? 'Resolved',
        resolutionDate: val(gr, ['resolution_date']) ? new Date(val(gr, ['resolution_date'])) : new Date(),
      },
    });
  }

  // 11) Seller Applications
  const apps = sheetRows['seller_applications'] || [];
  for (const a of apps) {
    const sellerRef = a['seller_reference'] ?? a['seller_id'] ?? null;
    const sellerId = sellerRef != null ? sellerMap.get(Number(sellerRef)) : undefined;
    const statusRaw = String(val(a, ['verification_status']) || '').toLowerCase();
    let status: any = 'SUBMITTED';
    if (statusRaw.includes('verified') || statusRaw.includes('approved')) status = 'APPROVED';
    if (statusRaw.includes('pending')) status = 'UNDER_REVIEW';
    // resolve fallback seller for application
    const fallbackAppSeller = (await prisma.seller.findFirst())?.id ?? '';
    const sellerAppResolved = sellerId ?? fallbackAppSeller;
    await prisma.sellerApplication.upsert({
      where: { sellerId: sellerAppResolved },
      update: {
        status: status,
        submittedAt: a['submitted_date'] ? new Date(a['submitted_date']) : new Date(),
        reviewedAt: status === 'APPROVED' ? new Date() : undefined,
        reviewedBy: 'excel_import',
        notes: a['notes'] ?? undefined,
      },
      create: {
        sellerId: sellerAppResolved,
        status: status,
        submittedAt: a['submitted_date'] ? new Date(a['submitted_date']) : new Date(),
        reviewedAt: status === 'APPROVED' ? new Date() : undefined,
        reviewedBy: 'excel_import',
        notes: a['notes'] ?? undefined,
      },
    });
  }

  // 12) Seller Invitations (new table)
  const invitations = sheetRows['seller_invitations'] || [];
  for (const inv of invitations) {
    // prefer using new sellerInvitation model if available
    if ((prisma as any).sellerInvitation) {
      await (prisma as any).sellerInvitation.create({
        data: {
          excelId: Number(val(inv, ['id']) ?? 0),
          sellerExcelId: Number(val(inv, ['seller_id']) ?? 0),
          gapExcelId: Number(val(inv, ['gap_id']) ?? 0),
          sentBy: val(inv, ['sent_by']) ?? val(inv, ['sent_by']) ?? undefined,
          sentDate: inv['sent_date'] ? new Date(inv['sent_date']) : new Date(),
          status: val(inv, ['status']) ?? undefined,
        },
      });
    }
  }

  // 13) Product Reviews (new table)
  const reviews = sheetRows['product_reviews'] || [];
  for (const r of reviews) {
    if ((prisma as any).productReview) {
      await (prisma as any).productReview.create({
        data: {
          excelReviewId: Number(val(r, ['id']) ?? 0),
          productExcelId: Number(val(r, ['product_id']) ?? 0),
          reviewerName: val(r, ['reviewer_name']) ?? undefined,
          decision: val(r, ['decision']) ?? val(r, ['status']) ?? undefined,
          reviewDate: r['review_date'] ? new Date(r['review_date']) : undefined,
        },
      });
    }
  }

  // 14) Seller Audit Logs
  const audits = sheetRows['seller_audit_logs'] || [];
  for (const al of audits) {
    await prisma.sellerAuditLog.create({
      data: {
        sellerId: Number(val(al, ['seller_id']) ?? 0),
        action: String(val(al, ['action']) ?? 'action'),
        performedBy: String(val(al, ['performed_by']) ?? 'import'),
        actionDate: al['action_date'] ? new Date(al['action_date']) : new Date(),
      },
    });
  }

  // 15) Notifications
  const notes = sheetRows['notifications'] || [];
  for (const n of notes) {
    await prisma.notification.create({
      data: {
        recipientType: String(val(n, ['recipient_type']) || val(n,['recipientType']) || 'System'),
        recipientId: Number(val(n, ['recipient_id']) ?? 0),
        title: String(val(n, ['title']) ?? 'Notification'),
        isRead: toBool(val(n, ['is_read']) ?? val(n, ['isRead'])) || false,
        createdAt: n['created_at'] ? new Date(n['created_at']) : new Date(),
      },
    });
  }

  console.log('✅ Excel import completed successfully.');
}

main()
  .catch((e) => {
    console.error('Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
