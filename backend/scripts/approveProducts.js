const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function approveProducts() {
  try {
    console.log('Approving all products...\n');
    
    const result = await prisma.product.updateMany({
      where: { status: 'PENDING' },
      data: { 
        status: 'APPROVED',
        available: true
      }
    });
    
    console.log(`✓ Updated ${result.count} products to APPROVED status`);
    
    const approvedCount = await prisma.product.count({ where: { status: 'APPROVED' } });
    console.log(`Total approved products: ${approvedCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

approveProducts();
