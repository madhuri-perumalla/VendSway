import { PrismaClient, UserRole, FashionRelevance, Seasonality, SellerStatus, ApplicationStatus, GapPriority, MetricType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
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

  // Create Users
  console.log('👤 Creating users...');
  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      name: 'Admin User',
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      email: 'seller@demo.com',
      password: 'seller123',
      role: UserRole.SELLER,
      name: 'Demo Seller',
    },
  });

  // Create Regions
  console.log('🗺️  Creating regions...');
  const andhraPradesh = await prisma.region.create({
    data: {
      name: 'Andhra Pradesh',
      code: 'AP',
      centerLat: 15.9129,
      centerLng: 79.7400,
      description: 'Known for Pochampally Ikat, Kalamkari, and rich textile heritage',
    },
  });

  const tamilNadu = await prisma.region.create({
    data: {
      name: 'Tamil Nadu',
      code: 'TN',
      centerLat: 11.1271,
      centerLng: 78.6569,
      description: 'Famous for Kanchipuram silk, Madurai cotton, and temple textiles',
    },
  });

  const westBengal = await prisma.region.create({
    data: {
      name: 'West Bengal',
      code: 'WB',
      centerLat: 22.9868,
      centerLng: 87.8550,
      description: 'Renowned for Baluchari, Tant, and Jamdani sarees',
    },
  });

  const rajasthan = await prisma.region.create({
    data: {
      name: 'Rajasthan',
      code: 'RJ',
      centerLat: 27.0238,
      centerLng: 74.2179,
      description: 'Known for Bandhani, Leheriya, and vibrant Rajasthani textiles',
    },
  });

  const gujarat = await prisma.region.create({
    data: {
      name: 'Gujarat',
      code: 'GJ',
      centerLat: 22.2587,
      centerLng: 71.1924,
      description: 'Famous for Patola, Bandhani, and Kutch embroidery',
    },
  });

  // Create Festivals
  console.log('🎉 Creating festivals...');
  const sankrantiAP = await prisma.festival.create({
    data: {
      name: 'Sankranti',
      regionId: andhraPradesh.id,
      date: new Date('2026-01-14'),
      description: 'Harvest festival celebrating new beginnings',
      fashionRelevance: FashionRelevance.HIGH,
    },
  });

  const pongalTN = await prisma.festival.create({
    data: {
      name: 'Pongal',
      regionId: tamilNadu.id,
      date: new Date('2026-01-15'),
      description: 'Tamil harvest festival with traditional attire',
      fashionRelevance: FashionRelevance.HIGH,
    },
  });

  const durgaPujaWB = await prisma.festival.create({
    data: {
      name: 'Durga Puja',
      regionId: westBengal.id,
      date: new Date('2026-10-02'),
      description: 'Major Bengali festival with traditional sarees',
      fashionRelevance: FashionRelevance.HIGH,
    },
  });

  const navratriRJ = await prisma.festival.create({
    data: {
      name: 'Navratri',
      regionId: rajasthan.id,
      date: new Date('2026-10-03'),
      description: 'Nine-night festival with colorful traditional wear',
      fashionRelevance: FashionRelevance.HIGH,
    },
  });

  const navratriGJ = await prisma.festival.create({
    data: {
      name: 'Navratri',
      regionId: gujarat.id,
      date: new Date('2026-10-03'),
      description: 'Gujarati festival with traditional chaniya choli',
      fashionRelevance: FashionRelevance.HIGH,
    },
  });

  // Create Textiles
  console.log('🧵 Creating textiles...');
  const pochampallyIkat = await prisma.textile.create({
    data: {
      name: 'Pochampally Ikat',
      regionId: andhraPradesh.id,
      description: 'Traditional double-ikat weaving technique from Telangana/Andhra',
      giTagged: true,
    },
  });

  const kalamkari = await prisma.textile.create({
    data: {
      name: 'Kalamkari',
      regionId: andhraPradesh.id,
      description: 'Hand-painted or block-printed cotton textile',
      giTagged: true,
    },
  });

  const kanchipuramSilk = await prisma.textile.create({
    data: {
      name: 'Kanchipuram Silk',
      regionId: tamilNadu.id,
      description: 'Premium silk sarees from Kanchipuram',
      giTagged: true,
    },
  });

  await prisma.textile.create({
    data: {
      name: 'Madurai Cotton',
      regionId: tamilNadu.id,
      description: 'Soft cotton sarees with temple borders',
      giTagged: false,
    },
  });

  const baluchari = await prisma.textile.create({
    data: {
      name: 'Baluchari Saree',
      regionId: westBengal.id,
      description: 'Silk sarees with mythological scenes',
      giTagged: true,
    },
  });

  await prisma.textile.create({
    data: {
      name: 'Tant Saree',
      regionId: westBengal.id,
      description: 'Traditional Bengali cotton sarees',
      giTagged: false,
    },
  });

  const bandhani = await prisma.textile.create({
    data: {
      name: 'Bandhani',
      regionId: rajasthan.id,
      description: 'Tie-dye technique from Rajasthan',
      giTagged: true,
    },
  });

  await prisma.textile.create({
    data: {
      name: 'Leheriya',
      regionId: rajasthan.id,
      description: 'Wave-pattern dyeing technique',
      giTagged: false,
    },
  });

  const patola = await prisma.textile.create({
    data: {
      name: 'Patola',
      regionId: gujarat.id,
      description: 'Double-ikat silk sarees from Patan',
      giTagged: true,
    },
  });

  await prisma.textile.create({
    data: {
      name: 'Kutch Embroidery',
      regionId: gujarat.id,
      description: 'Mirror work embroidery from Kutch',
      giTagged: false,
    },
  });

  // Create GI Products
  console.log('🏷️  Creating GI products...');
  const pochampallySarees = await prisma.gIProduct.create({
    data: {
      name: 'Pochampally Ikat Sarees',
      regionId: andhraPradesh.id,
      category: 'Sarees',
      description: 'Geometric pattern sarees using traditional ikat technique',
      registrationNumber: 'GI-AP-001',
    },
  });

  const kanchipuramSilkSarees = await prisma.gIProduct.create({
    data: {
      name: 'Kanchipuram Silk Sarees',
      regionId: tamilNadu.id,
      category: 'Sarees',
      description: 'Premium silk sarees with temple borders',
      registrationNumber: 'GI-TN-001',
    },
  });

  const baluchariSarees = await prisma.gIProduct.create({
    data: {
      name: 'Baluchari Sarees',
      regionId: westBengal.id,
      category: 'Sarees',
      description: 'Silk sarees depicting mythological scenes',
      registrationNumber: 'GI-WB-001',
    },
  });

  const rajasthaniBandhani = await prisma.gIProduct.create({
    data: {
      name: 'Rajasthani Bandhani',
      regionId: rajasthan.id,
      category: 'Fabrics',
      description: 'Traditional tie-dye fabrics',
      registrationNumber: 'GI-RJ-001',
    },
  });

  const patolaSilk = await prisma.gIProduct.create({
    data: {
      name: 'Patola Silk',
      regionId: gujarat.id,
      category: 'Sarees',
      description: 'Double-ikat silk sarees from Patan',
      registrationNumber: 'GI-GJ-001',
    },
  });

  // Create Sellers
  console.log('🏪 Creating sellers...');
  const seller1 = await prisma.seller.create({
    data: {
      userId: sellerUser.id,
      businessName: 'Pochampally Weavers Co-op',
      contactPerson: 'Ramesh Kumar',
      email: 'ramesh@pochampally.com',
      phone: '+91-9876543210',
      location: 'Pochampally, Telangana',
      regionId: andhraPradesh.id,
      giTagged: true,
      msme: true,
      msmeNumber: 'MSME-TG-001',
      categories: ['Sarees', 'Fabrics'],
      productionCapacity: 100,
      rating: 4.8,
      status: SellerStatus.APPROVED,
    },
  });

  const seller2 = await prisma.seller.create({
    data: {
      businessName: 'Kanchipuram Silk Weavers',
      contactPerson: 'Lakshmi Devi',
      email: 'lakshmi@kanchipuram.com',
      phone: '+91-9876543211',
      location: 'Kanchipuram, Tamil Nadu',
      regionId: tamilNadu.id,
      giTagged: true,
      msme: true,
      msmeNumber: 'MSME-TN-001',
      categories: ['Sarees'],
      productionCapacity: 80,
      rating: 4.9,
      status: SellerStatus.APPROVED,
    },
  });

  const seller3 = await prisma.seller.create({
    data: {
      businessName: 'Baluchari Artisans',
      contactPerson: 'Priya Das',
      email: 'priya@baluchari.com',
      phone: '+91-9876543212',
      location: 'Murshidabad, West Bengal',
      regionId: westBengal.id,
      giTagged: true,
      msme: true,
      msmeNumber: 'MSME-WB-001',
      categories: ['Sarees'],
      productionCapacity: 60,
      rating: 4.7,
      status: SellerStatus.APPROVED,
    },
  });

  const seller4 = await prisma.seller.create({
    data: {
      businessName: 'Rajasthan Textiles',
      contactPerson: 'Vikram Singh',
      email: 'vikram@rajasthan.com',
      phone: '+91-9876543213',
      location: 'Jaipur, Rajasthan',
      regionId: rajasthan.id,
      giTagged: true,
      msme: true,
      msmeNumber: 'MSME-RJ-001',
      categories: ['Sarees', 'Fabrics', 'Dupattas'],
      productionCapacity: 120,
      rating: 4.6,
      status: SellerStatus.APPROVED,
    },
  });

  const seller5 = await prisma.seller.create({
    data: {
      businessName: 'Gujarat Handloom',
      contactPerson: 'Meera Patel',
      email: 'meera@gujarat.com',
      phone: '+91-9876543214',
      location: 'Patan, Gujarat',
      regionId: gujarat.id,
      giTagged: true,
      msme: true,
      msmeNumber: 'MSME-GJ-001',
      categories: ['Sarees', 'Fabrics'],
      productionCapacity: 90,
      rating: 4.8,
      status: SellerStatus.APPROVED,
    },
  });

  // Create Seller Applications
  console.log('📝 Creating seller applications...');
  await prisma.sellerApplication.create({
    data: {
      sellerId: seller1.id,
      status: ApplicationStatus.APPROVED,
      submittedAt: new Date('2026-06-01'),
      reviewedAt: new Date('2026-06-05'),
      reviewedBy: 'Admin User',
      notes: 'Excellent GI-tagged products',
    },
  });

  await prisma.sellerApplication.create({
    data: {
      sellerId: seller2.id,
      status: ApplicationStatus.APPROVED,
      submittedAt: new Date('2026-06-02'),
      reviewedAt: new Date('2026-06-06'),
      reviewedBy: 'Admin User',
      notes: 'Premium silk quality verified',
    },
  });

  await prisma.sellerApplication.create({
    data: {
      sellerId: seller3.id,
      status: ApplicationStatus.APPROVED,
      submittedAt: new Date('2026-06-03'),
      reviewedAt: new Date('2026-06-07'),
      reviewedBy: 'Admin User',
      notes: 'Authentic Baluchari technique confirmed',
    },
  });

  await prisma.sellerApplication.create({
    data: {
      sellerId: seller4.id,
      status: ApplicationStatus.APPROVED,
      submittedAt: new Date('2026-06-04'),
      reviewedAt: new Date('2026-06-08'),
      reviewedBy: 'Admin User',
      notes: 'Traditional Bandhani verified',
    },
  });

  await prisma.sellerApplication.create({
    data: {
      sellerId: seller5.id,
      status: ApplicationStatus.APPROVED,
      submittedAt: new Date('2026-06-05'),
      reviewedAt: new Date('2026-06-09'),
      reviewedBy: 'Admin User',
      notes: 'Patola technique authenticated',
    },
  });

  // Create Products
  console.log('👗 Creating products...');
  const product1 = await prisma.product.create({
    data: {
      name: 'Pochampally Ikat Silk Saree - Traditional',
      category: 'Sarees',
      regionId: andhraPradesh.id,
      sellerId: seller1.id,
      giProductId: pochampallySarees.id,
      price: 8500,
      giTagged: true,
      description: 'Traditional geometric pattern ikat silk saree with temple border',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      available: true,
      stock: 25,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Pochampally Ikat Cotton Saree - Modern',
      category: 'Sarees',
      regionId: andhraPradesh.id,
      sellerId: seller1.id,
      giProductId: pochampallySarees.id,
      price: 4500,
      giTagged: true,
      description: 'Modern ikat cotton saree with contemporary patterns',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      available: true,
      stock: 40,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Kanchipuram Silk Saree - Temple Border',
      category: 'Sarees',
      regionId: tamilNadu.id,
      sellerId: seller2.id,
      giProductId: kanchipuramSilkSarees.id,
      price: 12000,
      giTagged: true,
      description: 'Premium silk saree with intricate temple border design',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      available: true,
      stock: 15,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Baluchari Silk Saree - Mythological',
      category: 'Sarees',
      regionId: westBengal.id,
      sellerId: seller3.id,
      giProductId: baluchariSarees.id,
      price: 9500,
      giTagged: true,
      description: 'Silk saree depicting scenes from epics',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      available: true,
      stock: 20,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'Rajasthani Bandhani Saree - Red',
      category: 'Sarees',
      regionId: rajasthan.id,
      sellerId: seller4.id,
      giProductId: rajasthaniBandhani.id,
      price: 3500,
      giTagged: true,
      description: 'Traditional red bandhani saree with mirror work',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      available: true,
      stock: 50,
    },
  });

  const product6 = await prisma.product.create({
    data: {
      name: 'Patola Silk Saree - Double Ikat',
      category: 'Sarees',
      regionId: gujarat.id,
      sellerId: seller5.id,
      giProductId: patolaSilk.id,
      price: 15000,
      giTagged: true,
      description: 'Premium double-ikat silk saree from Patan',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      available: true,
      stock: 10,
    },
  });

  const product7 = await prisma.product.create({
    data: {
      name: 'Kalamkari Cotton Fabric - 5 Meters',
      category: 'Fabrics',
      regionId: andhraPradesh.id,
      sellerId: seller1.id,
      price: 2500,
      giTagged: true,
      description: 'Hand-painted kalamkari cotton fabric',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      available: true,
      stock: 30,
    },
  });

  const product8 = await prisma.product.create({
    data: {
      name: 'Kanchipuram Silk Fabric - 6 Meters',
      category: 'Fabrics',
      regionId: tamilNadu.id,
      sellerId: seller2.id,
      price: 8000,
      giTagged: true,
      description: 'Premium silk fabric for custom sarees',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
      available: true,
      stock: 20,
    },
  });

  // Create Product-Textile relationships
  console.log('🔗 Creating product-textile relationships...');
  await prisma.productTextile.create({
    data: {
      productId: product1.id,
      textileId: pochampallyIkat.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product2.id,
      textileId: pochampallyIkat.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product3.id,
      textileId: kanchipuramSilk.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product4.id,
      textileId: baluchari.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product5.id,
      textileId: bandhani.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product6.id,
      textileId: patola.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product7.id,
      textileId: kalamkari.id,
    },
  });

  await prisma.productTextile.create({
    data: {
      productId: product8.id,
      textileId: kanchipuramSilk.id,
    },
  });

  // Create Catalog Items (Mock Myntra catalog)
  console.log('📦 Creating catalog items...');
  await prisma.catalogItem.create({
    data: {
      productId: product1.id,
      regionId: andhraPradesh.id,
      category: 'Sarees',
      availableQuantity: 15,
    },
  });

  await prisma.catalogItem.create({
    data: {
      productId: product3.id,
      regionId: tamilNadu.id,
      category: 'Sarees',
      availableQuantity: 10,
    },
  });

  await prisma.catalogItem.create({
    data: {
      productId: product4.id,
      regionId: westBengal.id,
      category: 'Sarees',
      availableQuantity: 12,
    },
  });

  await prisma.catalogItem.create({
    data: {
      productId: product5.id,
      regionId: rajasthan.id,
      category: 'Sarees',
      availableQuantity: 25,
    },
  });

  await prisma.catalogItem.create({
    data: {
      productId: product6.id,
      regionId: gujarat.id,
      category: 'Sarees',
      availableQuantity: 8,
    },
  });

  // Create Demand Signals
  console.log('📊 Creating demand signals...');
  await prisma.demandSignal.create({
    data: {
      regionId: andhraPradesh.id,
      category: 'Sarees',
      festivalId: sankrantiAP.id,
      demandScore: 85,
      seasonality: Seasonality.HIGH,
      source: 'Historical Data',
      period: 'Q1 2026',
    },
  });

  await prisma.demandSignal.create({
    data: {
      regionId: tamilNadu.id,
      category: 'Sarees',
      festivalId: pongalTN.id,
      demandScore: 90,
      seasonality: Seasonality.HIGH,
      source: 'Historical Data',
      period: 'Q1 2026',
    },
  });

  await prisma.demandSignal.create({
    data: {
      regionId: westBengal.id,
      category: 'Sarees',
      festivalId: durgaPujaWB.id,
      demandScore: 88,
      seasonality: Seasonality.HIGH,
      source: 'Historical Data',
      period: 'Q4 2026',
    },
  });

  await prisma.demandSignal.create({
    data: {
      regionId: rajasthan.id,
      category: 'Sarees',
      festivalId: navratriRJ.id,
      demandScore: 82,
      seasonality: Seasonality.HIGH,
      source: 'Historical Data',
      period: 'Q4 2026',
    },
  });

  await prisma.demandSignal.create({
    data: {
      regionId: gujarat.id,
      category: 'Sarees',
      festivalId: navratriGJ.id,
      demandScore: 87,
      seasonality: Seasonality.HIGH,
      source: 'Historical Data',
      period: 'Q4 2026',
    },
  });

  await prisma.demandSignal.create({
    data: {
      regionId: andhraPradesh.id,
      category: 'Fabrics',
      demandScore: 75,
      seasonality: Seasonality.MEDIUM,
      source: 'Market Research',
      period: 'Q1 2026',
    },
  });

  await prisma.demandSignal.create({
    data: {
      regionId: tamilNadu.id,
      category: 'Fabrics',
      demandScore: 78,
      seasonality: Seasonality.MEDIUM,
      source: 'Market Research',
      period: 'Q1 2026',
    },
  });

  // Create Catalog Gaps
  console.log('🔍 Creating catalog gaps...');
  await prisma.catalogGap.create({
    data: {
      regionId: andhraPradesh.id,
      category: 'Sarees',
      festivalId: sankrantiAP.id,
      productId: product1.id,
      demand: 450,
      available: 15,
      gap: 435,
      priority: GapPriority.HIGH,
      identifiedAt: new Date('2026-07-01'),
    },
  });

  await prisma.catalogGap.create({
    data: {
      regionId: tamilNadu.id,
      category: 'Sarees',
      festivalId: pongalTN.id,
      productId: product3.id,
      demand: 380,
      available: 10,
      gap: 370,
      priority: GapPriority.HIGH,
      identifiedAt: new Date('2026-07-01'),
    },
  });

  await prisma.catalogGap.create({
    data: {
      regionId: westBengal.id,
      category: 'Sarees',
      festivalId: durgaPujaWB.id,
      productId: product4.id,
      demand: 320,
      available: 12,
      gap: 308,
      priority: GapPriority.HIGH,
      identifiedAt: new Date('2026-07-01'),
    },
  });

  await prisma.catalogGap.create({
    data: {
      regionId: rajasthan.id,
      category: 'Sarees',
      festivalId: navratriRJ.id,
      productId: product5.id,
      demand: 280,
      available: 25,
      gap: 255,
      priority: GapPriority.MEDIUM,
      identifiedAt: new Date('2026-07-01'),
    },
  });

  await prisma.catalogGap.create({
    data: {
      regionId: gujarat.id,
      category: 'Sarees',
      festivalId: navratriGJ.id,
      productId: product6.id,
      demand: 250,
      available: 8,
      gap: 242,
      priority: GapPriority.HIGH,
      identifiedAt: new Date('2026-07-01'),
    },
  });

  await prisma.catalogGap.create({
    data: {
      regionId: andhraPradesh.id,
      category: 'Fabrics',
      demand: 200,
      available: 30,
      gap: 170,
      priority: GapPriority.MEDIUM,
      identifiedAt: new Date('2026-07-01'),
    },
  });

  // Create Regional Trends
  console.log('📈 Creating regional trends...');
  await prisma.regionalTrend.create({
    data: {
      regionId: andhraPradesh.id,
      category: 'Sarees',
      trendScore: 85,
      seasonality: Seasonality.HIGH,
      period: 'Q1 2026',
      source: 'Social Media Analysis',
    },
  });

  await prisma.regionalTrend.create({
    data: {
      regionId: tamilNadu.id,
      category: 'Sarees',
      trendScore: 90,
      seasonality: Seasonality.HIGH,
      period: 'Q1 2026',
      source: 'Social Media Analysis',
    },
  });

  await prisma.regionalTrend.create({
    data: {
      regionId: westBengal.id,
      category: 'Sarees',
      trendScore: 88,
      seasonality: Seasonality.HIGH,
      period: 'Q4 2026',
      source: 'Social Media Analysis',
    },
  });

  await prisma.regionalTrend.create({
    data: {
      regionId: rajasthan.id,
      category: 'Sarees',
      trendScore: 82,
      seasonality: Seasonality.HIGH,
      period: 'Q4 2026',
      source: 'Social Media Analysis',
    },
  });

  await prisma.regionalTrend.create({
    data: {
      regionId: gujarat.id,
      category: 'Sarees',
      trendScore: 87,
      seasonality: Seasonality.HIGH,
      period: 'Q4 2026',
      source: 'Social Media Analysis',
    },
  });

  // Create Regional Collections
  console.log('🎨 Creating regional collections...');
  const sankrantiCollection = await prisma.regionalCollection.create({
    data: {
      name: 'Andhra Sankranti Special',
      regionId: andhraPradesh.id,
      festivalId: sankrantiAP.id,
      description: 'Curated collection for Sankranti festival',
      isActive: true,
    },
  });

  const pongalCollection = await prisma.regionalCollection.create({
    data: {
      name: 'Tamil Nadu Pongal Collection',
      regionId: tamilNadu.id,
      festivalId: pongalTN.id,
      description: 'Traditional Pongal festival collection',
      isActive: true,
    },
  });

  const durgaPujaCollection = await prisma.regionalCollection.create({
    data: {
      name: 'Bengal Durga Puja Collection',
      regionId: westBengal.id,
      festivalId: durgaPujaWB.id,
      description: 'Festive Durga Puja collection',
      isActive: true,
    },
  });

  const navratriCollection = await prisma.regionalCollection.create({
    data: {
      name: 'Rajasthan Navratri Special',
      regionId: rajasthan.id,
      festivalId: navratriRJ.id,
      description: 'Colorful Navratri collection',
      isActive: true,
    },
  });

  const gujaratNavratriCollection = await prisma.regionalCollection.create({
    data: {
      name: 'Gujarat Navratri Collection',
      regionId: gujarat.id,
      festivalId: navratriGJ.id,
      description: 'Traditional Gujarati Navratri collection',
      isActive: true,
    },
  });

  // Create Regional Collection Products
  console.log('🏷️  Creating collection products...');
  await prisma.regionalCollectionProduct.create({
    data: {
      collectionId: sankrantiCollection.id,
      productId: product1.id,
    },
  });

  await prisma.regionalCollectionProduct.create({
    data: {
      collectionId: sankrantiCollection.id,
      productId: product2.id,
    },
  });

  await prisma.regionalCollectionProduct.create({
    data: {
      collectionId: pongalCollection.id,
      productId: product3.id,
    },
  });

  await prisma.regionalCollectionProduct.create({
    data: {
      collectionId: durgaPujaCollection.id,
      productId: product4.id,
    },
  });

  await prisma.regionalCollectionProduct.create({
    data: {
      collectionId: navratriCollection.id,
      productId: product5.id,
    },
  });

  await prisma.regionalCollectionProduct.create({
    data: {
      collectionId: gujaratNavratriCollection.id,
      productId: product6.id,
    },
  });

  // Create Analytics Snapshots
  console.log('📊 Creating analytics snapshots...');
  await prisma.analyticsSnapshot.create({
    data: {
      regionId: andhraPradesh.id,
      metricType: MetricType.DEMAND,
      metricValue: 450,
      period: 'Q1 2026',
      additionalData: {
        category: 'Sarees',
        festival: 'Sankranti',
      },
    },
  });

  await prisma.analyticsSnapshot.create({
    data: {
      regionId: tamilNadu.id,
      metricType: MetricType.DEMAND,
      metricValue: 380,
      period: 'Q1 2026',
      additionalData: {
        category: 'Sarees',
        festival: 'Pongal',
      },
    },
  });

  await prisma.analyticsSnapshot.create({
    data: {
      regionId: westBengal.id,
      metricType: MetricType.GAP,
      metricValue: 308,
      period: 'Q4 2026',
      additionalData: {
        category: 'Sarees',
        festival: 'Durga Puja',
      },
    },
  });

  await prisma.analyticsSnapshot.create({
    data: {
      regionId: rajasthan.id,
      metricType: MetricType.SELLER,
      metricValue: 120,
      period: 'Q4 2026',
      additionalData: {
        activeSellers: 1,
        totalCapacity: 120,
      },
    },
  });

  await prisma.analyticsSnapshot.create({
    data: {
      regionId: gujarat.id,
      metricType: MetricType.GAP,
      metricValue: 242,
      period: 'Q4 2026',
      additionalData: {
        category: 'Sarees',
        festival: 'Navratri',
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Users: 2`);
  console.log(`   - Regions: 5`);
  console.log(`   - Festivals: 5`);
  console.log(`   - Textiles: 10`);
  console.log(`   - GI Products: 5`);
  console.log(`   - Sellers: 5`);
  console.log(`   - Products: 8`);
  console.log(`   - Catalog Items: 5`);
  console.log(`   - Demand Signals: 7`);
  console.log(`   - Catalog Gaps: 6`);
  console.log(`   - Regional Trends: 5`);
  console.log(`   - Regional Collections: 5`);
  console.log(`   - Analytics Snapshots: 5`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
