import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTestUser() {
  try {
    // Update existing test user to have SELLER role
    const user = await prisma.user.updateMany({
      where: { email: 'admin@vendsway.com' },
      data: { role: 'ADMIN' },
    });

    console.log('✅ Test user role updated to ADMIN');
    console.log('   Affected rows:', user.count);
  } catch (error) {
    console.error('❌ Error updating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTestUser();