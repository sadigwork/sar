import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/index';
import {
  ApplicationStatus,
  ReviewDecision,
  Role,
  ApplicationType,
} from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WorkflowService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  // 🧠 جلب workflow
  async getWorkflow(applicationType: ApplicationType) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { applicationType },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!workflow) {
      throw new BadRequestException('Workflow not configured');
    }

    return workflow;
  }

  // 🔍 المرحلة الحالية
  async getCurrentStage(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) throw new BadRequestException('Application not found');

    const workflow = await this.getWorkflow(app.type);

    return workflow.stages.find((s) => s.code === app.currentStage);
  }

  // 🔁 المرحلة التالية
  getNextStage(workflow: any, currentStage: any) {
    const index = workflow.stages.findIndex((s) => s.id === currentStage.id);
    return workflow.stages[index + 1] || null;
  }

  // 🔐 صلاحيات
  canReview(stage: any, role: Role) {
    return stage.requiredRole === role;
  }

  // ✅ اكتمال المرحلة
  async isStageCompleted(applicationId: string, stage: any) {
    const approvals = await this.prisma.applicationReview.count({
      where: {
        applicationId,
        stage: stage.code,
        decision: ReviewDecision.APPROVED,
      },
    });

    return approvals >= stage.minApprovals;
  }

  // 🚀 تنفيذ review
  async processReview(params: {
    applicationId: string;
    reviewerId: string;
    role: Role;
    decision: ReviewDecision;
    comment?: string;
  }) {
    const { applicationId, reviewerId, role, decision, comment } = params;

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new BadRequestException('Application not found');
    }

    const workflow = await this.getWorkflow(application.type);

    const currentStage = workflow.stages.find(
      (s) => s.code === application.currentStage,
    );

    if (!currentStage) {
      throw new BadRequestException('Invalid stage');
    }

    if (!this.canReview(currentStage, role)) {
      throw new BadRequestException('Not allowed');
    }

    return this.prisma.$transaction(async (tx) => {
      // 📝 سجل review
      await tx.applicationReview.create({
        data: {
          applicationId,
          reviewerId,
          role,
          stage: currentStage.code,
          decision,
          comment,
        },
      });

      // ❌ رفض
      if (decision === ReviewDecision.REJECTED) {
        this.eventEmitter.emit(
          'workflow.rejected',
          new WorkflowEvent(applicationId, 'REJECTED', {
            stage: currentStage.code,
          }),
        );
        return tx.application.update({
          where: { id: applicationId },
          data: {
            status: ApplicationStatus.REJECTED,
            currentStage: null,
          },
        });
      }

      // 🔁 تعديل
      if (decision === ReviewDecision.REQUEST_CHANGES) {
        this.eventEmitter.emit(
          'workflow.stage.changed',
          new WorkflowEvent(applicationId, 'STAGE_CHANGED', {
            from: currentStage.code,
            to: nextStage.code,
          }),
        );
        return tx.application.update({
          where: { id: applicationId },
          data: {
            status: ApplicationStatus.SUBMITTED,
          },
        });
      }

      // ✅ تحقق من اكتمال المرحلة
      const completed = await this.isStageCompleted(
        applicationId,
        currentStage,
      );

      if (!completed) {
        return { message: 'Waiting for more approvals' };
      }

      // 🔁 المرحلة التالية
      const nextStage = this.getNextStage(workflow, currentStage);

      // 🎉 النهاية
      if (!nextStage) {
        this.eventEmitter.emit(
          'workflow.completed',
          new WorkflowEvent(applicationId, 'APPROVED'),
        );
        return tx.application.update({
          where: { id: applicationId },
          data: {
            status: ApplicationStatus.APPROVED,
            currentStage: null,
          },
        });
      }

      return tx.application.update({
        where: { id: applicationId },
        data: {
          currentStage: nextStage.code,
          status: ApplicationStatus.IN_REVIEW,
        },
      });
    });
  }
}
