import {
  PrismaClient,
  Role,
  ApplicationStatus,
  ApplicationType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ENGINEERS_COUNT = 50;
const APPLICATIONS_PER_ENGINEER = 2;

async function createSystemUsers(password: string) {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sacrs.ly' },
    update: {},
    create: {
      email: 'admin@sacrs.ly',
      password,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@sacrs.ly' },
    update: {},
    create: {
      email: 'reviewer@sacrs.ly',
      password,
      firstName: 'Application',
      lastName: 'Reviewer',
      role: Role.REVIEWER,
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: 'accountant@sacrs.ly' },
    update: {},
    create: {
      email: 'accountant@sacrs.ly',
      password,
      firstName: 'Finance',
      lastName: 'Officer',
      role: Role.ACCOUNTANT,
    },
  });

  return { admin, reviewer, accountant };
}

async function createEngineers(password: string, reviewerId: string) {
  for (let i = 0; i < ENGINEERS_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        password,
        firstName,
        lastName,
        role: Role.USER,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        fullNameAr: `${firstName} ${lastName}`,
        fullNameEn: `${firstName} ${lastName}`,
        nationalId: faker.string.numeric(12),
        phone: faker.phone.number('+2189########'),
        city: faker.location.city(),
        country: 'Libya',
        status: 'APPROVED',
      },
    });

    for (let j = 0; j < APPLICATIONS_PER_ENGINEER; j++) {
      const application = await prisma.application.create({
        data: {
          userId: user.id,
          profileId: profile.id,
          type: ApplicationType.REGISTRATION,
          status: ApplicationStatus.SUBMITTED,
        },
      });

      await prisma.applicationReview.create({
        data: {
          applicationId: application.id,
          reviewerId,
          role: Role.REVIEWER,
          decision: 'APPROVED',
          comment: faker.lorem.sentence(),
        },
      });
    }

    if (i % 10 === 0) {
      console.log(`Generated ${i} engineers`);
    }
  }
}

async function main() {
  console.log('🌱 Seeding database...');

  const password = await bcrypt.hash('Password123', 10);

  const { reviewer } = await createSystemUsers(password);

  await createEngineers(password, reviewer.id);

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
