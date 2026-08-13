const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('Checking database for products and sellers...\n');
    
    const products = await prisma.product.count();
    console.log('Total products count:', products);
    
    const approvedProducts = await prisma.product.count({ where: { status: 'APPROVED' } });
    console.log('Approved products count:', approvedProducts);
    
    const sellers = await prisma.seller.count();
    console.log('Total sellers count:', sellers);
    
    const approvedSellers = await prisma.seller.count({ where: { status: 'APPROVED' } });
    console.log('Approved sellers count:', approvedSellers);
    
    const activeSellers = await prisma.seller.count({ where: { status: 'APPROVED', isActive: true } });
    console.log('Active approved sellers count:', activeSellers);
    
    // Sample product
    const sampleProduct = await prisma.product.findFirst();
    console.log('\nSample product:', sampleProduct);
    
    // Sample seller
    const sampleSeller = await prisma.seller.findFirst();
    console.log('\nSample seller:', sampleSeller);
    
    // Check products with regionId
    const productsWithRegion = await prisma.product.findMany({
      where: { regionId: { not: null } },
      take: 3
    });
    console.log('\nProducts with regionId:', productsWithRegion.length);
    if (productsWithRegion.length > 0) {
      console.log('Sample:', productsWithRegion[0]);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
