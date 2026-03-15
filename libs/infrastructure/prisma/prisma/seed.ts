import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123', 10);

  // =========================
  // Admin
  // =========================

  const admin = await prisma.user.create({
    data: {
      email: 'admin@system.com',
      password,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  // =========================
  // Reviewer
  // =========================

  const reviewer = await prisma.user.create({
    data: {
      email: 'reviewer@system.com',
      password,
      firstName: 'Application',
      lastName: 'Reviewer',
      role: Role.REVIEWER,
    },
  });

  // =========================
  // Accountant
  // =========================

  const accountant = await prisma.user.create({
    data: {
      email: 'accountant@system.com',
      password,
      firstName: 'Finance',
      lastName: 'Officer',
      role: Role.ACCOUNTANT,
    },
  });

  // =========================
  // Engineer User
  // =========================

  const engineer = await prisma.user.create({
    data: {
      email: 'engineer@test.com',
      password,
      firstName: 'Ahmed',
      lastName: 'Ali',
      role: Role.USER,
    },
  });

  // =========================
  // Profile
  // =========================

  const profile = await prisma.profile.create({
    data: {
      userId: engineer.id,
      fullNameAr: 'أحمد محمد علي',
      fullNameEn: 'Ahmed Mohamed Ali',
      nationalId: '119876543210',
      phone: '+218912345678',
      city: 'Tripoli',
      country: 'Libya',
      status: 'APPROVED',
    },
  });

  // =========================
  // Application
  // =========================

  const application = await prisma.application.create({
    data: {
      userId: engineer.id,
      profileId: profile.id,
      type: 'NEW_REGISTRATION',
      status: 'SUBMITTED',
    },
  });

  // =========================
  // Review
  // =========================

  await prisma.applicationReview.create({
    data: {
      applicationId: application.id,
      reviewerId: reviewer.id,
      role: Role.REVIEWER,
      decision: 'APPROVED',
      comment: 'Application verified successfully',
    },
  });

  console.log('🌱 Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
