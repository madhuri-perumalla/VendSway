const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking database data...\n');
    
    const potentialSellers = await prisma.potentialSeller.count();
    console.log('Potential sellers count:', potentialSellers);
    
    const sellers = await prisma.seller.count();
    console.log('Approved sellers count:', sellers);
    
    const invitations = await prisma.sellerInvitation.count();
    console.log('Seller invitations count:', invitations);
    
    const demandSignals = await prisma.demandSignal.count();
    console.log('Demand signals count:', demandSignals);
    
    const catalogGaps = await prisma.catalogGap.count();
    console.log('Catalog gaps count:', catalogGaps);
    
    // Sample potential seller
    const sampleSeller = await prisma.potentialSeller.findFirst();
    console.log('\nSample potential seller:', sampleSeller);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
