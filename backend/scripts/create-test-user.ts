import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@demo.com' }
    });
    
    if (existingUser) {
      // Update existing user with password
      await prisma.user.update({
        where: { email: 'admin@demo.com' },
        data: { password: hashedPassword }
      });
      console.log('Updated existing admin user with password');
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          email: 'admin@demo.com',
          password: hashedPassword,
          name: 'Admin User',
          role: UserRole.ADMIN,
          isEmailVerified: true
        }
      });
      console.log('Created new admin user');
    }
    
    console.log('Test user: admin@demo.com / password123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();