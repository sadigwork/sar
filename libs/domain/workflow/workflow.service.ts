import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/index';
import { ReviewDecision, ReviewStage } from '@prisma/client';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  // 🔍 جلب المرحلة الحالية
  async getCurrentStage(applicationId: string): Promise<ReviewStage | null> {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    return app.currentStage;
  }

  // ✅ هل المرحلة مكتملة؟
  async isStageCompleted(applicationId: string, stage: ReviewStage) {
    const reviews = await this.prisma.applicationReview.findMany({
      where: { applicationId, stage },
    });

    if (reviews.length === 0) return false;

    return reviews.every((r) => r.decision === ReviewDecision.APPROVED);
  }

  // ❌ هل هناك رفض؟
  async hasRejection(applicationId: string, stage: ReviewStage) {
    const reviews = await this.prisma.applicationReview.findMany({
      where: { applicationId, stage },
    });

    return reviews.some((r) => r.decision === ReviewDecision.REJECTED);
  }

  // 🔁 الانتقال للمرحلة التالية
  async moveToNextStage(applicationId: string) {
    const stages = [
      'REGISTRAR_REVIEW',
      'REVIEWER_REVIEW',
      'FINANCE_REVIEW',
      'ADMIN_REVIEW',
    ];

    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    const currentIndex = stages.indexOf(app.currentStage as any);

    // نهاية الرحلة
    if (currentIndex === stages.length - 1) {
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { status: 'APPROVED' },
      });
      return;
    }

    const nextStage = stages[currentIndex + 1];

    await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        currentStage: nextStage as any,
      },
    });
  }

  // 🔥 القرار الذكي بعد كل Review
  async processAfterReview(applicationId: string, stage: ReviewStage) {
    // ❌ رفض → انتهى
    if (await this.hasRejection(applicationId, stage)) {
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { status: 'REJECTED' },
      });
      return;
    }

    // ✅ كلهم وافقوا → التالي
    if (await this.isStageCompleted(applicationId, stage)) {
      await this.moveToNextStage(applicationId);
    }
  }

  // 🧨 Admin Override
  async adminOverride(
    applicationId: string,
    decision: ReviewDecision,
    adminId: string,
    reason: string,
  ) {
    // تسجيل Review خاص
    await this.prisma.applicationReview.create({
      data: {
        applicationId,
        reviewerId: adminId,
        role: 'ADMIN',
        stage: 'ADMIN_REVIEW',
        decision,
        isOverride: true,
        overrideReason: reason,
      },
    });

    // تحديث مباشر
    await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      },
    });

    // 🔐 Log
    await this.prisma.activityLog.create({
      data: {
        userId: adminId,
        action: 'ADMIN_OVERRIDE',
        entity: 'Application',
        entityId: applicationId,
        metadata: {
          decision,
          reason,
        },
      },
    });
  }
}
