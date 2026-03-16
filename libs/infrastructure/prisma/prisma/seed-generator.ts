import {
  PrismaClient,
  Role,
  ApplicationStatus,
  ApplicationType,
  ReviewDecision,
} from '@prisma/client';

import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USERS = 500;
const APPLICATIONS_PER_USER = 3;

async function main() {
  console.log('🌱 Generating large dataset...');

  const password = await bcrypt.hash('Password123', 10);

  const reviewer = await prisma.user.findFirst({
    where: { role: Role.REVIEWER },
  });

  if (!reviewer) {
    throw new Error('Reviewer not found. Run base seed first.');
  }

  for (let i = 0; i < USERS; i++) {
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
        phone: faker.phone.number('+249########'),
        city: faker.location.city(),
        country: 'Sudan',
        status: 'APPROVED',
      },
    });

    for (let j = 0; j < APPLICATIONS_PER_USER; j++) {
      const typeOptions = [
        ApplicationType.REGISTRATION,
        ApplicationType.RENEWAL,
      ];

      const statusOptions = [
        ApplicationStatus.SUBMITTED,
        ApplicationStatus.APPROVED,
        ApplicationStatus.REJECTED,
      ];

      const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];

      const status =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          profileId: profile.id,
          type,
          status,
        },
      });

      const decision =
        status === ApplicationStatus.APPROVED
          ? ReviewDecision.APPROVED
          : status === ApplicationStatus.REJECTED
            ? ReviewDecision.REJECTED
            : ReviewDecision.APPROVED;

      await prisma.applicationReview.create({
        data: {
          applicationId: application.id,
          reviewerId: reviewer.id,
          role: Role.REVIEWER,
          decision,
          comment: faker.lorem.sentence(),
        },
      });

      await prisma.payment.create({
        data: {
          applicationId: application.id,
          amount: faker.number.int({ min: 100, max: 300 }),
          currency: 'SSG',
          status: 'PAID',
          reference: faker.string.alphanumeric(12),
        },
      });
    }

    if (i % 50 === 0) {
      console.log(`Generated ${i} users`);
    }
  }

  console.log('✅ Dataset generation completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
