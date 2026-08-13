const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('Checking product categories...\n');
    
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    
    const categories = products.map(p => p.category);
    console.log('Unique categories:', categories);
    console.log(`Total unique categories: ${categories.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
