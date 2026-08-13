import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== Checking Database State ===\n');

    // Check sellers
    const sellers = await prisma.seller.findMany({
      where: { isActive: true },
      take: 5,
      include: { region: true },
    });
    console.log(`Active Sellers: ${sellers.length}`);
    if (sellers.length > 0) {
      console.log('Sample seller:', {
        id: sellers[0].id,
        businessName: sellers[0].businessName,
        regionId: sellers[0].regionId,
        region: sellers[0].region?.name,
      });
    }

    // Check missions
    const missions = await prisma.sellerMission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { seller: true },
    });
    console.log(`\nTotal Missions: ${missions.length}`);
    if (missions.length > 0) {
      console.log('Latest mission:', {
        id: missions[0].id,
        sellerId: missions[0].sellerId,
        seller: missions[0].seller?.businessName,
        missionType: missions[0].missionType,
        status: missions[0].status,
        createdAt: missions[0].createdAt,
      });
    }

    // Check festivals
    const festivals = await prisma.festival.findMany({
      take: 5,
      orderBy: { date: 'asc' },
    });
    console.log(`\nUpcoming Festivals: ${festivals.length}`);
    if (festivals.length > 0) {
      console.log('Sample festival:', {
        id: festivals[0].id,
        name: festivals[0].name,
        date: festivals[0].date,
      });
    }

    // Check demand signals
    const demandSignals = await prisma.demandSignal.findMany({
      take: 5,
      orderBy: { demandScore: 'desc' },
    });
    console.log(`\nDemand Signals: ${demandSignals.length}`);
    if (demandSignals.length > 0) {
      console.log('Sample demand signal:', {
        id: demandSignals[0].id,
        regionId: demandSignals[0].regionId,
        category: demandSignals[0].category,
        demandScore: demandSignals[0].demandScore,
      });
    }

    // Check products
    const products = await prisma.product.findMany({
      where: { status: 'APPROVED', available: true },
      take: 5,
    });
    console.log(`\nAvailable Approved Products: ${products.length}`);

    // Check regions
    const regions = await prisma.region.findMany();
    console.log(`\nTotal Regions: ${regions.length}`);
    if (regions.length > 0) {
      console.log('Sample regions:', regions.slice(0, 3).map(r => ({ id: r.id, name: r.name })));
    }

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
