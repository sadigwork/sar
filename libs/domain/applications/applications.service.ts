import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { ProfileStatus } from '../profiles/index';
import { WorkflowService } from '../workflow/index';
import { PaymentStatus, PaymentMethod } from '../payments/index';
import { ApplicationStatus, ProfileStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowService: WorkflowService,
  ) {}

  // =========================
  // Create Application
  // =========================
  async createApplication(userId: string, dto: CreateApplicationDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { educations: true, experiences: true, documents: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    const completion = this.calculateProfileCompletion(profile);
    if (completion < 80 || profile.status !== ProfileStatus.APPROVED) {
      throw new ForbiddenException(
        `Cannot submit application: profile completion is ${completion}% or not approved`,
      );
    }

    if (profile.status !== ProfileStatus.APPROVED) {
      throw new BadRequestException(
        'Profile must be completed before submitting application',
      );
    }
    return this.prisma.application.create({
      data: {
        userId,
        profileId: profile.id,
        type: dto.type,
        status: ApplicationStatus.DRAFT,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.application.findMany({ where: { userId } });
  }

  async findSubmitted() {
    return this.prisma.application.findMany({
      where: {
        status: {
          in: [ApplicationStatus.SUBMITTED, ApplicationStatus.REVIEWER_REVIEW],
        },
      },
    });
  }
  // =========================
  // Submit Application (User)
  // =========================
  async submitApplication(userId: string, applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { profile: true },
    });

    if (!app || app.userId !== userId)
      throw new NotFoundException('Application not found or access denied');

    const completion = this.calculateProfileCompletion(app.profile);
    if (completion < 80 || app.profile.status !== ProfileStatus.APPROVED) {
      throw new ForbiddenException(
        `Cannot submit: profile completion ${completion}% or not approved`,
      );
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.SUBMITTED, submittedAt: new Date() },
    });
  }

  // =========================
  // Admin / Reviewer Actions
  // =========================
  async reviewApplication(
    applicationId: string,
    reviewerId: string,
    decision: 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES',
    comment?: string,
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new NotFoundException('Application not found');

    // 🔹 جلب المرحلة الحالية من workflowService
    const stage = await this.workflowService.getCurrentStage(applicationId);

    // 🔹 التحقق من مراجعة نفس المرحلة مسبقًا
    const existing = await this.prisma.applicationReview.findFirst({
      where: { applicationId, reviewerId, stage },
    });
    if (existing)
      throw new BadRequestException('You already reviewed this stage');

    // 🔹 حفظ المراجعة
    const reviewer = await this.prisma.user.findUnique({
      where: { id: reviewerId },
    });
    const review = await this.prisma.applicationReview.create({
      data: {
        applicationId,
        reviewerId,
        role: reviewer?.role || 'REVIEWER',
        stage,
        decision,
        comment,
      },
    });

    // 🔹 تشغيل Workflow Engine لمعالجة الحالة
    await this.workflowService.processAfterReview(applicationId, stage);

    return review;
  }

  // =========================
  // Payments
  // =========================
  async submitPayment(
    applicationId: string,
    userId: string,
    amount: number,
    method: PaymentMethod,
  ) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app || app.userId !== userId)
      throw new NotFoundException('Application not found or access denied');

    if (app.status !== 'SUBMITTED') {
      throw new BadRequestException(
        'Cannot pay for an application that is not submitted',
      );
    }

    return this.prisma.payment.create({
      data: {
        applicationId,
        userId,
        amount,
        currency: 'USD',
        method,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async verifyPayment(paymentId: string, verifierId: string, approve: boolean) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const newStatus = approve ? PaymentStatus.VERIFIED : PaymentStatus.REJECTED;

    // تحديث الدفع
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus },
    });

    // تحديث حالة التطبيق بعد الدفع
    if (approve) {
      await this.prisma.application.update({
        where: { id: payment.applicationId },
        data: { status: 'PAYMENT_VERIFIED' },
      });
    }

    return { paymentId, newStatus };
  }

  // =========================
  // Helpers
  // =========================
  private calculateProfileCompletion(profile: any): number {
    let score = 0;
    const personalFields = [
      'fullNameAr',
      'fullNameEn',
      'nationalId',
      'specialization',
      'graduationYear',
      'university',
    ];
    const filled = personalFields.filter((f) => profile[f]);
    score += (filled.length / personalFields.length) * 40;
    if (profile.educations.length) score += 20;
    if (profile.experiences.length) score += 20;
    if (profile.documents.length) score += 20;
    return Math.round(score);
  }

  async getUserProfile(userId: string) {
    return this.prisma.profile.findUnique({ where: { userId } });
  }
}
