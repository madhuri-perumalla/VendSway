import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSellerUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'seller@demo.com' }
    });
    
    if (existingUser) {
      // Update existing user with password
      await prisma.user.update({
        where: { email: 'seller@demo.com' },
        data: { password: hashedPassword }
      });
      console.log('Updated existing seller user with password');
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          email: 'seller@demo.com',
          password: hashedPassword,
          name: 'Demo Seller',
          role: UserRole.SELLER,
          isEmailVerified: true
        }
      });
      console.log('Created new seller user');
    }
    
    console.log('Test seller user: seller@demo.com / password123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSellerUser();