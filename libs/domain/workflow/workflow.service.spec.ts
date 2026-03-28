import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { PrismaService } from '../../infrastructure/prisma/src/index';
import { prismaMock } from '../../../test/mocks/prisma.mock';
import { ReviewDecision, Role } from '@prisma/client';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ اختبار جلب workflow
  it('should return workflow', async () => {
    prismaMock.workflow.findFirst.mockResolvedValue({
      stages: [],
    });

    const result = await service.getWorkflow('REGISTRATION' as any);

    expect(result).toBeDefined();
  });

  // ❌ اختبار عدم وجود workflow
  it('should throw if workflow not found', async () => {
    prismaMock.workflow.findFirst.mockResolvedValue(null);

    await expect(service.getWorkflow('REGISTRATION' as any)).rejects.toThrow();
  });

  // ✅ اختبار approval flow
  it('should approve and move to next stage', async () => {
    prismaMock.application.findUnique.mockResolvedValue({
      id: 'app1',
      type: 'REGISTRATION',
      currentStage: 'REGISTRAR_REVIEW',
    });

    prismaMock.workflow.findFirst.mockResolvedValue({
      stages: [
        {
          id: '1',
          code: 'REGISTRAR_REVIEW',
          requiredRole: 'REGISTRAR',
          minApprovals: 1,
        },
        {
          id: '2',
          code: 'REVIEWER_REVIEW',
          requiredRole: 'REVIEWER',
          minApprovals: 1,
        },
      ],
    });

    prismaMock.applicationReview.count.mockResolvedValue(1);

    prismaMock.application.update.mockResolvedValue({
      currentStage: 'REVIEWER_REVIEW',
    });

    const result = await service.processReview({
      applicationId: 'app1',
      reviewerId: 'user1',
      role: Role.REGISTRAR,
      decision: ReviewDecision.APPROVED,
    });

    expect(result).toBeDefined();
  });

  // ❌ اختبار رفض
  it('should reject application', async () => {
    prismaMock.application.findUnique.mockResolvedValue({
      id: 'app1',
      type: 'REGISTRATION',
      currentStage: 'REGISTRAR_REVIEW',
    });

    prismaMock.workflow.findFirst.mockResolvedValue({
      stages: [
        {
          id: '1',
          code: 'REGISTRAR_REVIEW',
          requiredRole: 'REGISTRAR',
          minApprovals: 1,
        },
      ],
    });

    prismaMock.application.update.mockResolvedValue({
      status: 'REJECTED',
    });

    const result = await service.processReview({
      applicationId: 'app1',
      reviewerId: 'user1',
      role: Role.REGISTRAR,
      decision: ReviewDecision.REJECTED,
    });

    expect(result.status).toBe('REJECTED');
  });

  // ❌ صلاحيات
  it('should block unauthorized role', async () => {
    prismaMock.application.findUnique.mockResolvedValue({
      id: 'app1',
      type: 'REGISTRATION',
      currentStage: 'REGISTRAR_REVIEW',
    });

    prismaMock.workflow.findFirst.mockResolvedValue({
      stages: [
        {
          id: '1',
          code: 'REGISTRAR_REVIEW',
          requiredRole: 'REGISTRAR',
          minApprovals: 1,
        },
      ],
    });

    await expect(
      service.processReview({
        applicationId: 'app1',
        reviewerId: 'user1',
        role: Role.USER,
        decision: ReviewDecision.APPROVED,
      }),
    ).rejects.toThrow();
  });
});
