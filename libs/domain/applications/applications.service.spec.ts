import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
import { WorkflowService } from '../workflow/index';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: PrismaService;

  const prismaMock = {
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
    },
  };

  const workflowMock = {
    getCurrentStage: jest.fn().mockResolvedValue('REGISTRAR_REVIEW'),
    processAfterReview: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: WorkflowService, useValue: workflowMock },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create application', async () => {
    prisma.profile.findUnique = jest.fn().mockResolvedValue({ id: 'p1' });
    prisma.application.findFirst = jest.fn().mockResolvedValue(null);
    prisma.application.create.mockResolvedValue({
      id: '1',
      status: 'DRAFT',
    });

    const result = await service.createApplication('user1', {
      type: 'REGISTRATION',
    } as any);

    expect(result.id).toBe('1');
    expect(prisma.application.create).toHaveBeenCalled();
  });

  it('should return applications for profile', async () => {
    prisma.application.findMany.mockResolvedValue([{ id: '1' }, { id: '2' }]);

    const result = await service.getMyApplications('user1');

    expect(result.length).toBe(2);
  });

  it('should submit application when profile is submitted and completion >=80', async () => {
    prisma.application.findUnique = jest.fn().mockResolvedValue({
      id: 'app1',
      userId: 'user1',
      profileId: 'p1',
      profile: {
        status: 'SUBMITTED',
        fullNameAr: 'A',
        fullNameEn: 'A',
        nationalId: 'N',
        specialization: 'Spec',
        graduationYear: '2020',
        university: 'U',
        educations: [{ id: 'e1' }],
        experiences: [{ id: 'x1' }],
        documents: [{ id: 'd1' }],
      },
    });
    prisma.application.update.mockResolvedValue({
      id: 'app1',
      status: 'SUBMITTED',
    });

    const result = await service.submitApplication('user1', 'app1');

    expect(result.status).toBe('SUBMITTED');
    expect(prisma.application.update).toHaveBeenCalledWith({
      where: { id: 'app1' },
      data: { status: 'SUBMITTED', submittedAt: expect.any(Date) },
    });
  });

  it('should throw ForbiddenException when profile completion is below 80', async () => {
    prisma.application.findUnique = jest.fn().mockResolvedValue({
      id: 'app1',
      userId: 'user1',
      profileId: 'p1',
      profile: {
        status: 'SUBMITTED',
        fullNameAr: '',
        fullNameEn: '',
        nationalId: '',
        specialization: '',
        graduationYear: '',
        university: '',
        educations: [],
        experiences: [],
        documents: [],
      },
    });

    await expect(service.submitApplication('user1', 'app1')).rejects.toThrow(
      'Cannot submit: Profile completion is',
    );
  });

  it('should throw ForbiddenException when profile status is DRAFT', async () => {
    prisma.application.findUnique = jest.fn().mockResolvedValue({
      id: 'app2',
      userId: 'user1',
      profileId: 'p1',
      profile: {
        status: 'DRAFT',
        fullNameAr: 'A',
        fullNameEn: 'A',
        nationalId: 'N',
        specialization: 'Spec',
        graduationYear: '2020',
        university: 'U',
        educations: [{ id: 'e1' }],
        experiences: [{ id: 'x1' }],
        documents: [{ id: 'd1' }],
      },
    });

    await expect(service.submitApplication('user1', 'app2')).rejects.toThrow(
      'Cannot submit application until profile is submitted for review',
    );
  });

  it('should throw ForbiddenException when profile status is REJECTED', async () => {
    prisma.application.findUnique = jest.fn().mockResolvedValue({
      id: 'app3',
      userId: 'user1',
      profileId: 'p1',
      profile: {
        status: 'REJECTED',
        fullNameAr: 'A',
        fullNameEn: 'A',
        nationalId: 'N',
        specialization: 'Spec',
        graduationYear: '2020',
        university: 'U',
        educations: [{ id: 'e1' }],
        experiences: [{ id: 'x1' }],
        documents: [{ id: 'd1' }],
      },
    });

    await expect(service.submitApplication('user1', 'app3')).rejects.toThrow(
      'Cannot submit application because profile is rejected. Please update your profile and resubmit.',
    );
  });
});
