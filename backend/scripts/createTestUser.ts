import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@vendsway.com' },
    });

    if (existingUser) {
      console.log('✅ User already exists:', existingUser.email);
      console.log('   Name:', existingUser.name);
      console.log('   Role:', existingUser.role);
      console.log('   Phone:', existingUser.phone || 'Not provided');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@vendsway.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        phone: '+91 98765 43210',
        isEmailVerified: true,
        lastLoginAt: new Date(),
      },
    });

    console.log('✅ Test user created successfully!');
    console.log('   Email:', user.email);
    console.log('   Password: Admin@123');
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Phone:', user.phone);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();