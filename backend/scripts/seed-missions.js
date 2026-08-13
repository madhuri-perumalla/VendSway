// ============================================================================
// SEED MISSIONS SCRIPT
// ============================================================================
// Simple script to seed sample missions for demo purposes

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMissions() {
  try {
    console.log('Seeding sample missions...');
    
    // Get active sellers
    const sellers = await prisma.seller.findMany({
      where: { isActive: true },
      include: { region: true },
    });
    
    console.log(`Found ${sellers.length} active sellers`);
    
    if (sellers.length === 0) {
      console.log('No active sellers found. Creating a sample seller first...');
      
      // Create a sample seller if none exists
      const region = await prisma.region.findFirst();
      if (!region) {
        console.log('No regions found. Please create regions first.');
        return;
      }
      
      const seller = await prisma.seller.create({
        data: {
          businessName: 'Demo Handicrafts Store',
          contactPerson: 'John Doe',
          email: 'demo@example.com',
          phone: '9876543210',
          location: 'Delhi',
          regionId: region.id,
          categories: ['Handloom', 'Textiles', 'Crafts'],
          isActive: true,
          targetAudience: ['Women', '25-45'],
          avgOrderValue: 5000,
          conversionRate: 5,
          totalRevenue: 100000,
        },
      });
      
      sellers.push({ ...seller, region });
      console.log(`Created sample seller: ${seller.businessName}`);
    }
    
    // Get some products
    const products = await prisma.product.findMany({
      where: { status: 'APPROVED', available: true },
      take: 10,
    });
    
    console.log(`Found ${products.length} available products`);
    
    // Get a festival
    const festival = await prisma.festival.findFirst();
    
    // Create missions for each seller
    for (const seller of sellers) {
      console.log(`\nCreating mission for: ${seller.businessName}`);
      
      // Check if mission already exists for today
      const existingMission = await prisma.sellerMission.findFirst({
        where: {
          sellerId: seller.id,
          status: { in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });
      
      if (existingMission) {
        console.log('Mission already exists for today');
        continue;
      }
      
      // Create a sample mission
      const mission = await prisma.sellerMission.create({
        data: {
          sellerId: seller.id,
          festivalId: festival?.id,
          regionId: seller.regionId,
          missionType: 'FESTIVAL_SALES',
          opportunityScore: 85,
          confidence: 90,
          predictedRevenue: 15000,
          targetAudience: ['Women', '25-45'],
          targetAgeRange: '25-45',
          productCount: Math.min(products.length, 5),
          reason: `High demand for ${festival?.name || 'upcoming festival'} in ${seller.region?.name || 'your region'}`,
          recommendedAction: 'Promote handloom products with festival-themed marketing',
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });
      
      console.log(`✓ Created mission: ${mission.id}`);
      
      // Add products to mission
      const missionProducts = products.slice(0, 5);
      for (const product of missionProducts) {
        await prisma.missionProduct.create({
          data: {
            missionId: mission.id,
            productId: product.id,
            priority: 1,
            suggestedPrice: Number(product.price),
            quantity: 10,
          },
        });
      }
      
      console.log(`✓ Added ${missionProducts.length} products to mission`);
      
      // Create a sample opportunity
      const opportunity = await prisma.opportunity.create({
        data: {
          sellerId: seller.id,
          festivalId: festival?.id,
          regionId: seller.regionId,
          opportunityScore: 85,
          predictedRevenue: 15000,
          confidence: 90,
          reason: `Festival opportunity in ${seller.region?.name} with high demand for ethnic wear`,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      
      console.log(`✓ Created opportunity: ${opportunity.id}`);
      
      // Add products to opportunity
      for (const product of missionProducts) {
        await prisma.opportunityProduct.create({
          data: {
            opportunityId: opportunity.id,
            productId: product.id,
            priority: 1,
            suggestedPrice: Number(product.price),
          },
        });
      }
      
      console.log(`✓ Added products to opportunity`);
    }
    
    console.log('\n✅ Mission seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding missions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMissions();
