import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { WorkflowService } from '../workflow/index';
import { PaymentStatus, PaymentMethod } from '../payments/index';
import {
  ApplicationStatus,
  ProfileStatus,
  ApplicationType,
} from '@prisma/client';
import { getNextState } from '../workflow/application-workflow';
import { buildNotification } from '../workflow/notification-factory';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowService: WorkflowService,
  ) {}

  // =========================
  // GET OR CREATE DRAFT
  // =========================
  async getOrCreateDraft(userId: string) {
    let draft = await this.prisma.application.findFirst({
      where: {
        userId,
        status: ApplicationStatus.DRAFT,
      },
    });

    if (draft) return draft;

    // ✅ ensure profile exists
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: {
          userId,
          status: ProfileStatus.DRAFT,
        },
      });
    }

    return this.prisma.application.create({
      data: {
        userId,
        profileId: profile.id,
        status: ApplicationStatus.DRAFT,
        currentStep: 'personal',
        progress: 0,
      },
    });
  }

  // =========================
  // GET MY APPLICATIONS
  // =========================
  async getMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        profile: {
          select: {
            fullNameAr: true,
            fullNameEn: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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
  // UPDATE (Save Step)
  // =========================
  async updateApplication(
    userId: string,
    applicationId: string,
    dto: { step: string; data: any },
  ) {
    console.log('UPDATE APPLICATION:', { userId, applicationId, dto });
    console.log('DTO DATA:', JSON.stringify(dto.data, null, 2));

    let app;
    try {
      app = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: { profile: true },
      });
      console.log('FOUND APP:', app);
    } catch (error) {
      console.error('ERROR FETCHING APPLICATION:', error);
      throw new BadRequestException('Invalid application ID');
    }

    if (!app || app.userId !== userId) {
      console.error('APPLICATION NOT FOUND OR NOT OWNED', { app, userId });
      throw new NotFoundException('Application not found');
    }

    const profileId = app.profileId;
    if (!profileId) {
      console.error('INVALID APPLICATION WITHOUT PROFILE ID', {
        applicationId,
      });
      throw new BadRequestException('Invalid application profile link');
    }

    let profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        educations: true,
        experiences: true,
        documents: true,
      },
    });

    if (!profile) {
      console.error('PROFILE FOR APPLICATION NOT FOUND', { profileId });
      throw new NotFoundException('Profile for application not found');
    }

    try {
      switch (dto.step) {
        case 'personal':
          if (!dto.data || typeof dto.data !== 'object') {
            throw new BadRequestException(
              'Personal data is required and must be an object',
            );
          }

          // Validate required fields
          const requiredPersonalFields = [
            'fullName',
            'fullNameEn',
            'nationalId',
            'specialization',
            'university',
          ];
          const missingPersonalFields = requiredPersonalFields.filter(
            (field) =>
              !dto.data[field] || String(dto.data[field]).trim() === '',
          );

          if (missingPersonalFields.length > 0) {
            throw new BadRequestException(
              `Missing required personal fields: ${missingPersonalFields.join(', ')}`,
            );
          }

          await this.prisma.profile.update({
            where: { id: profileId },
            data: {
              fullNameAr: dto.data.fullName,
              fullNameEn: dto.data.fullNameEn,
              nationalId: dto.data.nationalId,
              phone: dto.data.phoneNumber || dto.data.phone,
              address: dto.data.address,
              specialization: dto.data.specialization,
              graduationYear: dto.data.graduationYear
                ? parseInt(dto.data.graduationYear)
                : null,
              university: dto.data.university,
            },
          });
          break;

        case 'education':
          if (!Array.isArray(dto.data)) {
            throw new BadRequestException('Education data must be an array');
          }

          // Allow empty education array (user might not have education yet)
          await this.prisma.education.deleteMany({ where: { profileId } });
          if (dto.data.length > 0) {
            // Validate each education entry
            for (const edu of dto.data) {
              if (
                !edu.degree ||
                !edu.field ||
                !edu.institution ||
                !edu.country
              ) {
                throw new BadRequestException(
                  'Each education entry must include degree, field, institution, and country',
                );
              }
            }

            await this.prisma.education.createMany({
              data: dto.data.map((e) => ({
                degree: e.degree,
                field: e.field,
                institution: e.institution,
                country: e.country,
                startYear: e.startYear ? parseInt(e.startYear) : null,
                endYear: e.endYear ? parseInt(e.endYear) : null,
                inProgress: e.inProgress || false,
                profileId,
              })),
            });
          }
          break;

        case 'experience':
          if (!Array.isArray(dto.data)) {
            throw new BadRequestException('Experience data must be an array');
          }

          // Allow empty experience array
          await this.prisma.experience.deleteMany({ where: { profileId } });
          if (dto.data.length > 0) {
            // Validate experience data
            for (const e of dto.data) {
              if (!e.company || !e.position || !e.startDate) {
                throw new BadRequestException(
                  'Company, position, and start date are required for each experience entry',
                );
              }
              if (!e.currentlyWorking && !e.endDate) {
                throw new BadRequestException(
                  'End date is required if not currently working',
                );
              }
            }

            await this.prisma.experience.createMany({
              data: dto.data.map((e) => {
                // Handle month format dates (yyyy-MM) by adding day if needed
                let startDateStr = e.startDate;
                if (startDateStr && startDateStr.length === 7) {
                  // yyyy-MM format
                  startDateStr += '-01'; // Add first day of month
                }

                let endDateStr = e.endDate;
                if (endDateStr && endDateStr.length === 7) {
                  // yyyy-MM format
                  endDateStr += '-01'; // Add first day of month
                }

                const startDate = new Date(startDateStr);
                const endDate = endDateStr ? new Date(endDateStr) : null;

                if (isNaN(startDate.getTime())) {
                  throw new BadRequestException(
                    `Invalid start date: ${e.startDate}`,
                  );
                }
                if (endDate && isNaN(endDate.getTime())) {
                  throw new BadRequestException(
                    `Invalid end date: ${e.endDate}`,
                  );
                }

                const isCurrent = e.currentlyWorking || false;
                const years = endDate
                  ? Math.floor(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24 * 365),
                    )
                  : 0;
                const months = endDate
                  ? Math.floor(
                      ((endDate.getTime() - startDate.getTime()) %
                        (1000 * 60 * 60 * 24 * 365)) /
                        (1000 * 60 * 60 * 24 * 30),
                    )
                  : 0;
                return {
                  company: e.company,
                  position: e.position,
                  startDate,
                  endDate,
                  isCurrent,
                  years,
                  months,
                  profileId,
                };
              }),
            });
          }
          break;

        case 'documents':
          if (!Array.isArray(dto.data)) {
            throw new BadRequestException('Documents data must be an array');
          }

          // Allow empty documents array
          await this.prisma.document.deleteMany({ where: { applicationId } });
          if (dto.data.length > 0) {
            const invalidDoc = dto.data.find(
              (d) => !d.type || !(d.file_url || d.fileUrl),
            );
            if (invalidDoc) {
              throw new BadRequestException(
                'Each document must include type and fileUrl/file_url',
              );
            }

            await this.prisma.document.createMany({
              data: dto.data.map((d) => {
                const normalizedStatus =
                  d.status && typeof d.status === 'string'
                    ? d.status.toUpperCase()
                    : 'PENDING';

                const safeStatus = ['PENDING', 'VERIFIED', 'REJECTED'].includes(
                  normalizedStatus,
                )
                  ? normalizedStatus
                  : 'PENDING';

                return {
                  type: d.type,
                  fileUrl: d.file_url || d.fileUrl,
                  status: safeStatus,
                  userId,
                  profileId,
                  applicationId,
                };
              }),
            });
          }
          break;

        case 'certifications':
          if (!Array.isArray(dto.data)) {
            throw new BadRequestException(
              'Certifications data must be an array',
            );
          }

          // Allow empty certifications array
          const validCerts = dto.data.filter(
            (c) =>
              c?.nameEn && c?.nameAr && c?.descriptionEn && c?.descriptionAr,
          );

          await this.prisma.certification.deleteMany({ where: { profileId } });
          if (validCerts.length > 0) {
            await this.prisma.certification.createMany({
              data: validCerts.map((c) => ({
                id: c.id, // optional, if passed
                profileId,
                nameEn: c.nameEn,
                nameAr: c.nameAr,
                descriptionEn: c.descriptionEn,
                descriptionAr: c.descriptionAr,
                status: c.status || 'pending',
                appliedDate: c.appliedDate
                  ? new Date(c.appliedDate)
                  : new Date(),
              })),
            });
          }
          break;

        default:
          throw new BadRequestException(
            `Invalid step: ${dto.step}. Valid steps are: personal, education, experience, documents, certifications`,
          );
      }

      profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          educations: true,
          experiences: true,
          documents: true,
        },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found after update');
      }

      const completion = this.calculateProfileCompletion(profile);
      await this.prisma.application.update({
        where: { id: applicationId },
        data: { progress: completion },
      });

      return {
        message: 'Step saved successfully',
        completion,
      };
    } catch (error) {
      console.error('ERROR IN updateApplication:', {
        applicationId,
        step: dto.step,
        error: error.message,
        stack: error.stack,
        data: JSON.stringify(dto.data, null, 2),
      });

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Could not save application step: ${error.message}`,
      );
    }
  }

  private calculateProfileCompletion(profile: any): number {
    let score = 0;

    // ======================
    // Personal Info (40%)
    // ======================

    const personalFields = [
      'fullNameAr',
      'fullNameEn',
      'nationalId',
      'specialization',
      'graduationYear',
      'university',
    ];

    const filledPersonal = personalFields.filter((f) => profile[f]);
    const personalScore = (filledPersonal.length / personalFields.length) * 40;

    score += personalScore;

    // ======================
    // Education (20%)
    // ======================

    if (profile.educations && profile.educations.length > 0) {
      score += 20;
    }

    // ======================
    // Experience (20%)
    // ======================

    if (profile.experiences && profile.experiences.length > 0) {
      score += 20;
    }

    // ======================
    // Documents (20%)
    // ======================

    if (profile.documents && profile.documents.length > 0) {
      score += 20;
    }

    return Math.round(score);
  }

  // =========================
  // SUBMIT
  // =========================
  async submitApplication(userId: string, applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { profile: true },
    });

    if (!app || app.userId !== userId) {
      throw new NotFoundException('Application not found');
    }

    if (!app.profile) {
      throw new BadRequestException(
        'Profile is required to submit application',
      );
    }

    const completion = this.calculateProfileCompletion(app.profile);

    if (completion < 80) {
      throw new ForbiddenException(
        `Cannot submit: Profile completion is ${completion}%. Minimum 80% required. Please complete your personal information, education, experience, and documents.`,
      );
    }

    // Check profile status
    if (app.profile.status === ProfileStatus.DRAFT) {
      throw new ForbiddenException(
        'Cannot submit application until profile is submitted for review. Please submit your profile first.',
      );
    }

    if (app.profile.status === ProfileStatus.REJECTED) {
      throw new ForbiddenException(
        'Cannot submit application because profile is rejected. Please update your profile and resubmit.',
      );
    }

    if (
      app.profile.status !== ProfileStatus.SUBMITTED &&
      app.profile.status !== ProfileStatus.APPROVED
    ) {
      throw new ForbiddenException(
        `Cannot submit application with profile status ${app.profile.status}. Profile must be submitted or approved first.`,
      );
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  // =========================
  // Admin / Reviewer Actions
  // =========================
  async reviewApplication(
    applicationId: string,
    userId: string,
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
      where: { applicationId, reviewerId: userId, stage },
    });
    if (existing)
      throw new BadRequestException('You already reviewed this stage');

    // 🔹 حفظ المراجعة
    const reviewer = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const review = await this.prisma.applicationReview.create({
      data: {
        applicationId,
        reviewerId: userId,
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
  // PAYMENTS
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

    if (!app || app.userId !== userId) {
      throw new NotFoundException('Application not found');
    }

    if (app.status !== ApplicationStatus.SUBMITTED) {
      throw new BadRequestException('Application must be submitted first');
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

  async verifyPayment(paymentId: string, approve: boolean) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    const status = approve ? PaymentStatus.VERIFIED : PaymentStatus.REJECTED;

    // تحديث الدفع
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });

    // تحديث حالة التطبيق بعد الدفع
    if (approve) {
      await this.prisma.application.update({
        where: { id: payment.applicationId },
        data: { status: ApplicationStatus.PAYMENT_VERIFIED },
      });
    }

    return { paymentId, status };
  }

  // =========================
  // Helpers
  // =========================
  private calculateProfileCompletion(profile: any): number {
    if (!profile) return 0;

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

    const educations = Array.isArray(profile.educations)
      ? profile.educations
      : [];
    const experiences = Array.isArray(profile.experiences)
      ? profile.experiences
      : [];
    const documents = Array.isArray(profile.documents) ? profile.documents : [];

    if (educations.length) score += 20;
    if (experiences.length) score += 20;
    if (documents.length) score += 20;
    return Math.round(score);
  }

  async getUserProfile(userId: string) {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  async performAction(id: string, user: any, action: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
    });

    const next = getNextState(
      {
        status: app.status,
        stage: app.currentStage,
      },
      user.role,
      action,
    );

    if (!next) {
      throw new Error('Invalid transition');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        status: next.status,
        currentStage: next.stage,
      },
    });

    // 🔔 Notification
    const notification = buildNotification({
      action,
      application: updated,
    });

    await this.prisma.notification.create({
      data: {
        userId: app.userId,
        ...notification,
        entity: 'APPLICATION',
        entityId: app.id,
      },
    });

    // 🧾 Activity Log
    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action,
        entity: 'APPLICATION',
        entityId: app.id,
        metadata: {
          from: app.status,
          to: next.status,
          stage: next.stage,
        },
      },
    });

    return updated;
  }
}
