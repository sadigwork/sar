import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: PrismaService;

  const prismaMock = {
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create application', async () => {
    prisma.application.create.mockResolvedValue({
      id: '1',
      status: 'DRAFT',
    });

    const result = await service.create({
      profileId: 'p1',
    });

    expect(result.id).toBe('1');
    expect(prisma.application.create).toHaveBeenCalled();
  });

  it('should return applications for profile', async () => {
    prisma.application.findMany.mockResolvedValue([{ id: '1' }, { id: '2' }]);

    const result = await service.findByProfile('p1');

    expect(result.length).toBe(2);
  });
});
