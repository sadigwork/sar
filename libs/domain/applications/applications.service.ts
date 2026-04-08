// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
// import { CreateApplicationDto } from './dto/create-application.dto';
// import { WorkflowService } from '../workflow/index';
// import { PaymentStatus, PaymentMethod } from '../payments/index';
// import {
//   ApplicationStatus,
//   ProfileStatus,
//   ApplicationType,
// } from '@prisma/client';
// import { getNextState } from '../workflow/application-workflow';
// import { buildNotification } from '../workflow/notification-factory';

// @Injectable()
// export class ApplicationsService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly workflowService: WorkflowService,
//   ) {}

//   // =========================
//   // HELPERS
//   // =========================

//   private async getOwnedApplication(userId: string, applicationId: string) {
//     const app = await this.prisma.application.findUnique({
//       where: { id: applicationId },
//       include: { profile: true },
//     });

//     if (!app || app.userId !== userId) {
//       throw new NotFoundException('Application not found');
//     }

//     return app;
//   }

//   private async getProfileOrFail(profileId: string) {
//     const profile = await this.prisma.profile.findUnique({
//       where: { id: profileId },
//       include: {
//         educations: true,
//         experiences: true,
//         documents: true,
//       },
//     });

//     if (!profile) {
//       throw new NotFoundException('Profile not found');
//     }

//     return profile;
//   }

//   private calculateProfileCompletion(profile: any): number {
//     if (!profile) return 0;

//     let score = 0;

//     const personalFields = [
//       'fullNameAr',
//       'fullNameEn',
//       'nationalId',
//       'specialization',
//       'graduationYear',
//       'university',
//     ];

//     const filled = personalFields.filter((f) => profile[f]);
//     score += (filled.length / personalFields.length) * 40;

//     if (profile.educations?.length) score += 20;
//     if (profile.experiences?.length) score += 20;
//     if (profile.documents?.length) score += 20;

//     return Math.round(score);
//   }

//   // =========================
//   // GET OR CREATE DRAFT
//   // =========================
//   async getOrCreateDraft(userId: string) {
//     let draft = await this.prisma.application.findFirst({
//       where: {
//         userId,
//         status: ApplicationStatus.DRAFT,
//       },
//     });

//     if (draft) return draft;

//     // ✅ ensure profile exists
//     let profile = await this.prisma.profile.findUnique({
//       where: { userId },
//     });

//     if (!profile) {
//       profile = await this.prisma.profile.create({
//         data: {
//           userId,
//           status: ProfileStatus.DRAFT,
//         },
//       });
//     }

//     return this.prisma.application.create({
//       data: {
//         userId,
//         profileId: profile.id,
//         status: ApplicationStatus.DRAFT,
//         currentStep: 'personal',
//         progress: 0,
//       },
//     });
//   }

//   // =========================
//   // GET MY APPLICATIONS
//   // =========================
//   async getMyApplications(userId: string) {
//     return this.prisma.application.findMany({
//       where: { userId },
//       include: {
//         profile: {
//           select: {
//             fullNameAr: true,
//             fullNameEn: true,
//           },
//         },
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async findSubmitted() {
//     return this.prisma.application.findMany({
//       where: {
//         status: {
//           in: [ApplicationStatus.SUBMITTED, ApplicationStatus.REVIEWER_REVIEW],
//         },
//       },
//     });
//   }

//   // =========================
//   // UPDATE (Save Step)
//   // =========================
//   async updateApplication(
//     userId: string,
//     applicationId: string,
//     dto: { step: string; data: any },
//   ) {
//     const app = await this.getOwnedApplication(userId, applicationId);
//     const profileId = app.profileId;

//     if (!profileId) {
//       throw new BadRequestException('Application has no profile');
//     }

//     await this.handleStepUpdate(
//       dto.step,
//       dto.data,
//       profileId,
//       applicationId,
//       userId,
//     );

//     const profile = await this.getProfileOrFail(profileId);
//     const completion = this.calculateProfileCompletion(profile);

//     await this.prisma.application.update({
//       where: { id: applicationId },
//       data: { progress: completion },
//     });

//     return {
//       message: 'Step saved successfully',
//       completion,
//     };
//   }

//   // =========================
//   // STEP HANDLER (CORE CLEAN)
//   // =========================
//   private async handleStepUpdate(
//     step: string,
//     data: any,
//     profileId: string,
//     applicationId: string,
//     userId: string,
//   ) {
//     switch (step) {
//       case 'personal':
//         return this.updatePersonal(profileId, data);

//       case 'education':
//         return this.updateEducation(profileId, data);

//       case 'experience':
//         return this.updateExperience(profileId, data);

//       case 'documents':
//         return this.updateDocuments(applicationId, profileId, userId, data);

//       case 'certifications':
//         return this.updateCertifications(profileId, data);

//       default:
//         throw new BadRequestException(`Invalid step: ${step}`);
//     }
//   }

//   // =========================
//   // STEP METHODS
//   // =========================

//   private async updatePersonal(profileId: string, data: any) {
//     if (!data || typeof data !== 'object') {
//       throw new BadRequestException('Invalid personal data');
//     }

//     const required = [
//       'fullName',
//       'fullNameEn',
//       'nationalId',
//       'specialization',
//       'university',
//     ];

//     const missing = required.filter((f) => !data[f]);
//     if (missing.length) {
//       throw new BadRequestException(`Missing fields: ${missing.join(', ')}`);
//     }

//     return this.prisma.profile.update({
//       where: { id: profileId },
//       data: {
//         fullNameAr: data.fullName,
//         fullNameEn: data.fullNameEn,
//         nationalId: data.nationalId,
//         phone: data.phoneNumber || data.phone,
//         address: data.address,
//         specialization: data.specialization,
//         graduationYear: data.graduationYear
//           ? parseInt(data.graduationYear)
//           : null,
//         university: data.university,
//       },
//     });
//   }

//   private async updateEducation(profileId: string, data: any[]) {
//     if (!Array.isArray(data)) {
//       throw new BadRequestException('Education must be array');
//     }

//     await this.prisma.education.deleteMany({ where: { profileId } });

//     if (!data.length) return;

//     return this.prisma.education.createMany({
//       data: data.map((e) => ({
//         ...e,
//         profileId,
//       })),
//     });
//   }

//   private async updateExperience(profileId: string, data: any[]) {
//     if (!Array.isArray(data)) {
//       throw new BadRequestException('Experience must be array');
//     }

//     await this.prisma.experience.deleteMany({ where: { profileId } });

//     if (!data.length) return;

//     return this.prisma.experience.createMany({
//       data: data.map((e) => ({
//         ...e,
//         startDate: new Date(e.startDate),
//         endDate: e.endDate ? new Date(e.endDate) : null,
//         profileId,
//       })),
//     });
//   }

//   private async updateDocuments(
//     applicationId: string,
//     profileId: string,
//     userId: string,
//     data: any[],
//   ) {
//     if (!Array.isArray(data)) {
//       throw new BadRequestException('Documents must be array');
//     }

//     await this.prisma.document.deleteMany({ where: { applicationId } });

//     if (!data.length) return;

//     return this.prisma.document.createMany({
//       data: data.map((d) => ({
//         type: d.type,
//         fileUrl: d.file_url || d.fileUrl,
//         status: 'PENDING',
//         userId,
//         profileId,
//         applicationId,
//       })),
//     });
//   }

//   private async updateCertifications(profileId: string, data: any[]) {
//     if (!Array.isArray(data)) {
//       throw new BadRequestException('Certifications must be array');
//     }

//     await this.prisma.certification.deleteMany({ where: { profileId } });

//     return this.prisma.certification.createMany({
//       data: data.map((c) => ({
//         ...c,
//         profileId,
//       })),
//     });
//   }

//   // =========================
//   // SUBMIT
//   // =========================
//   async submitApplication(userId: string, applicationId: string) {
//     const app = await this.getOwnedApplication(userId, applicationId);

//     const completion = this.calculateProfileCompletion(app.profile);

//     if (completion < 80) {
//       throw new ForbiddenException(`Completion ${completion}% أقل من المطلوب`);
//     }

//     return this.prisma.application.update({
//       where: { id: applicationId },
//       data: {
//         status: ApplicationStatus.SUBMITTED,
//         submittedAt: new Date(),
//       },
//     });
//   }

//   // =========================
//   // Admin / Reviewer Actions
//   // =========================
//   async reviewApplication(
//     applicationId: string,
//     userId: string,
//     decision: 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES',
//     comment?: string,
//   ) {
//     const app = await this.prisma.application.findUnique({
//       where: { id: applicationId },
//     });
//     if (!app) throw new NotFoundException('Application not found');

//     // 🔹 جلب المرحلة الحالية من workflowService
//     const stage = await this.workflowService.getCurrentStage(applicationId);

//     // 🔹 التحقق من مراجعة نفس المرحلة مسبقًا
//     const existing = await this.prisma.applicationReview.findFirst({
//       where: { applicationId, reviewerId: userId, stage },
//     });
//     if (existing)
//       throw new BadRequestException('You already reviewed this stage');

//     // 🔹 حفظ المراجعة
//     const reviewer = await this.prisma.user.findUnique({
//       where: { id: userId },
//     });
//     const review = await this.prisma.applicationReview.create({
//       data: {
//         applicationId,
//         reviewerId: userId,
//         role: reviewer?.role || 'REVIEWER',
//         stage,
//         decision,
//         comment,
//       },
//     });

//     // 🔹 تشغيل Workflow Engine لمعالجة الحالة
//     await this.workflowService.processAfterReview(applicationId, stage);

//     return review;
//   }

//   // =========================
//   // PAYMENTS
//   // =========================
//   async submitPayment(
//     applicationId: string,
//     userId: string,
//     amount: number,
//     method: PaymentMethod,
//   ) {
//     const app = await this.getOwnedApplication(userId, applicationId);

//     if (app.status !== ApplicationStatus.SUBMITTED) {
//       throw new BadRequestException('Submit application first');
//     }

//     return this.prisma.payment.create({
//       data: {
//         applicationId,
//         userId,
//         amount,
//         currency: 'USD',
//         method,
//         status: PaymentStatus.PENDING,
//       },
//     });
//   }

//   async verifyPayment(paymentId: string, approve: boolean) {
//     const payment = await this.prisma.payment.findUnique({
//       where: { id: paymentId },
//     });

//     if (!payment) throw new NotFoundException('Payment not found');

//     const status = approve ? PaymentStatus.VERIFIED : PaymentStatus.REJECTED;

//     // تحديث الدفع
//     await this.prisma.payment.update({
//       where: { id: paymentId },
//       data: { status },
//     });

//     // تحديث حالة التطبيق بعد الدفع
//     if (approve) {
//       await this.prisma.application.update({
//         where: { id: payment.applicationId },
//         data: { status: ApplicationStatus.PAYMENT_VERIFIED },
//       });
//     }

//     return { paymentId, status };
//   }

//   // =========================
//   // ACTIONS (WORKFLOW)
//   // =========================
//   async performAction(id: string, user: any, action: string) {
//     const app = await this.prisma.application.findUnique({
//       where: { id },
//     });

//     if (!app) throw new NotFoundException('Application not found');

//     const next = getNextState(
//       { status: app.status, stage: app.currentStage },
//       user.role,
//       action,
//     );

//     if (!next) throw new BadRequestException('Invalid transition');

//     const updated = await this.prisma.application.update({
//       where: { id },
//       data: {
//         status: next.status,
//         currentStage: next.stage,
//       },
//     });

//     const notification = buildNotification({
//       action,
//       application: updated,
//     });

//     await this.prisma.notification.create({
//       data: {
//         userId: app.userId,
//         ...notification,
//         entity: 'APPLICATION',
//         entityId: app.id,
//       },
//     });

//     return updated;
//   }

//   async getUserProfile(userId: string) {
//     return this.prisma.profile.findUnique({ where: { userId } });
//   }
// }
// =========================
// HELPERS
// =========================
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
import { WorkflowService } from '../workflow/index';
import { ApplicationStatus, ProfileStatus } from '@prisma/client';
import { getNextState } from '../workflow/application-workflow';
import { buildNotification } from '../workflow/notification-factory';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowService: WorkflowService,
  ) {}
  // =========================
  // HELPERS
  // =========================
  private async getOwnedApplication(userId: string, applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { profile: true },
    });

    if (!app || app.userId !== userId) {
      throw new NotFoundException('Application not found');
    }

    return app;
  }

  async getMyApplications(userId: string) {
    try {
      const applications = await this.prisma.application.findMany({
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

      // 🛡️ حماية من null relations
      return applications.map((app) => ({
        ...app,
        profile: app.profile ?? {
          fullNameAr: null,
          fullNameEn: null,
        },
      }));
    } catch (error) {
      console.error('getMyApplications ERROR:', error);

      throw new InternalServerErrorException({
        message: 'Failed to fetch applications',
        details: error?.message,
      });
    }
  }

  private async getProfileOrFail(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        educations: true,
        experiences: true,
        documents: true,
        certifications: true,
      },
    });

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

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

    if (profile.educations?.length) score += 20;
    if (profile.experiences?.length) score += 20;
    if (profile.documents?.length) score += 10;
    if (profile.certifications?.length) score += 10;

    return Math.round(score);
  }

  // =========================
  // GET OR CREATE DRAFT
  // =========================
  async getOrCreateDraft(userId: string) {
    try {
      let draft = await this.prisma.application.findFirst({
        where: {
          userId,
          status: 'DRAFT',
        },
        include: {
          profile: true,
        },
      });

      if (!draft) {
        // 🧠 إنشاء draft جديد + profile تلقائي
        draft = await this.prisma.application.create({
          data: {
            userId,
            status: 'DRAFT',
            profile: {
              create: {
                fullNameAr: '',
                fullNameEn: '',
                nationalId: '',
              },
            },
          },
          include: {
            profile: true,
          },
        });
      }

      return draft;
    } catch (error) {
      console.error('getOrCreateDraft ERROR:', error);

      throw new InternalServerErrorException({
        message: 'Failed to get or create draft',
        details: error?.message,
      });
    }
  }

  // =========================
  // UPDATE STEP (Draft / Autosave)
  // =========================
  async updateApplication(
    userId: string,
    applicationId: string,
    dto: { step: string; data: any },
  ) {
    const app = await this.getOwnedApplication(userId, applicationId);

    if (!app.profileId)
      throw new BadRequestException('Application has no profile');

    await this.handleStepUpdate(
      dto.step,
      dto.data,
      app.profileId,
      applicationId,
      userId,
    );

    const profile = await this.getProfileOrFail(app.profileId);
    const completion = this.calculateProfileCompletion(profile);

    // تحديث التقدم
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { progress: completion },
    });

    // إضافة Audit Log
    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'STEP_UPDATED',
        entity: 'APPLICATION',
        entityId: applicationId,
        meta: { step: dto.step, completion },
      },
    });

    return { message: 'Step saved successfully', completion };
  }

  private async handleStepUpdate(
    step: string,
    data: any,
    profileId: string,
    applicationId: string,
    userId: string,
  ) {
    switch (step) {
      case 'personal':
        await this.updatePersonal(profileId, data);
        break;
      case 'education':
        await this.updateEducation(profileId, data);
        break;
      case 'experience':
        await this.updateExperience(profileId, data);
        break;
      case 'documents':
        await this.updateDocuments(applicationId, profileId, userId, data);
        break;
      case 'certifications':
        await this.updateCertifications(profileId, data);
        break;
      default:
        throw new BadRequestException(`Invalid step: ${step}`);
    }
  }

  private async updatePersonal(profileId: string, data: any) {
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        fullNameAr: data.fullName,
        fullNameEn: data.fullNameEn,
        nationalId: data.nationalId,
        phone: data.phoneNumber || data.phone,
        address: data.address,
        specialization: data.specialization,
        graduationYear: data.graduationYear
          ? parseInt(data.graduationYear)
          : null,
        university: data.university,
      },
    });
  }

  private async updateEducation(profileId: string, data: any[]) {
    await this.prisma.education.deleteMany({ where: { profileId } });
    if (!data.length) return;
    return this.prisma.education.createMany({
      data: data.map((e) => ({ ...e, profileId })),
    });
  }

  private async updateExperience(profileId: string, data: any[]) {
    await this.prisma.experience.deleteMany({ where: { profileId } });
    if (!data.length) return;
    return this.prisma.experience.createMany({
      data: data.map((e) => ({
        ...e,
        profileId,
        startDate: new Date(e.startDate),
        endDate: e.endDate ? new Date(e.endDate) : null,
      })),
    });
  }

  private async updateDocuments(
    applicationId: string,
    profileId: string,
    userId: string,
    data: any[],
  ) {
    await this.prisma.document.deleteMany({ where: { applicationId } });
    if (!data.length) return;
    return this.prisma.document.createMany({
      data: data.map((d) => ({
        type: d.type,
        fileUrl: d.file_url || d.fileUrl,
        status: 'PENDING',
        userId,
        profileId,
        applicationId,
      })),
    });
  }

  private async updateCertifications(profileId: string, data: any[]) {
    await this.prisma.certification.deleteMany({ where: { profileId } });
    if (!data.length) return;
    return this.prisma.certification.createMany({
      data: data.map((c) => ({ ...c, profileId })),
    });
  }

  // =========================
  // SUBMIT APPLICATION
  // =========================
  async submitApplication(userId: string, applicationId: string) {
    const app = await this.getOwnedApplication(userId, applicationId);
    const completion = this.calculateProfileCompletion(app.profile);

    if (completion < 80) {
      throw new ForbiddenException(
        `Cannot submit. Completion ${completion}% < 80%`,
      );
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });

    // Notification للمستخدم
    const notification = buildNotification({
      action: 'SUBMIT',
      application: updated,
    });
    await this.prisma.notification.create({
      data: {
        userId,
        ...notification,
        entity: 'APPLICATION',
        entityId: updated.id,
      },
    });

    // Audit Log
    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'APPLICATION_SUBMITTED',
        entity: 'APPLICATION',
        entityId: applicationId,
      },
    });

    return updated;
  }

  async updateDraftStep(userId: string, step: string, data: any) {
    console.log(
      'updateDraftStep called with userId:',
      userId,
      'step:',
      step,
      'data:',
      JSON.stringify(data, null, 2),
    );
    try {
      const draft = await this.getOrCreateDraft(userId);
      console.log('Draft found/created:', draft);

      switch (step) {
        case 'personal':
          return await this.prisma.profile.update({
            where: { id: draft.profileId },
            data: {
              fullNameAr: data.fullName,
              fullNameEn: data.fullNameEn,
              nationalId: data.nationalId,
              phone: data.phoneNumber,
              dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
              gender: data.gender,
              address: data.address,
              city: data.city,
              country: data.country,
              specialization: data.specialization,
              graduationYear: data.graduationYear,
              university: data.university,
            },
          });

        case 'education':
          // 🧹 حذف القديم + إضافة الجديد (clean sync)
          await this.prisma.education.deleteMany({
            where: { profileId: draft.profileId },
          });

          return await this.prisma.education.createMany({
            data: data.map((edu) => ({
              ...edu,
              profileId: draft.profileId,
            })),
          });

        case 'experience':
          await this.prisma.experience.deleteMany({
            where: { profileId: draft.profileId },
          });

          return await this.prisma.experience.createMany({
            data: data.map((exp) => ({
              ...exp,
              profileId: draft.profileId,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
            })),
          });

        case 'documents':
          await this.prisma.document.deleteMany({
            where: { applicationId: draft.id },
          });

          return await this.prisma.document.createMany({
            data: data.map((doc) => ({
              ...doc,
              userId,
              applicationId: draft.id,
            })),
          });

        case 'certifications':
          await this.prisma.certification.deleteMany({
            where: { profileId: draft.profileId },
          });

          return await this.prisma.certification.createMany({
            data: data.map((cert) => ({
              ...cert,
              profileId: draft.profileId,
            })),
          });

        default:
          throw new BadRequestException('Invalid step');
      }
    } catch (error) {
      console.error('updateDraftStep ERROR:', error);

      throw new InternalServerErrorException({
        message: `Failed to update step: ${step}`,
        details: error?.message,
      });
    }
  }
  // =========================
  // REVIEW & DECISION
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

    const stage = await this.workflowService.getCurrentStage(applicationId);

    const existing = await this.prisma.applicationReview.findFirst({
      where: { applicationId, reviewerId, stage },
    });
    if (existing) throw new BadRequestException('Already reviewed this stage');

    const review = await this.prisma.applicationReview.create({
      data: { applicationId, reviewerId, stage, decision, comment },
    });

    // Update workflow
    await this.workflowService.processAfterReview(applicationId, stage);

    // Notification للمستخدم
    const notification = buildNotification({
      action: decision,
      application: app,
    });
    await this.prisma.notification.create({
      data: {
        userId: app.userId,
        ...notification,
        entity: 'APPLICATION',
        entityId: app.id,
      },
    });

    // Audit Log
    await this.prisma.activityLog.create({
      data: {
        userId: reviewerId,
        action: 'APPLICATION_REVIEWED',
        entity: 'APPLICATION',
        entityId: applicationId,
        meta: { decision, stage },
      },
    });

    return review;
  }

  // =========================
  // Timeline
  // =========================
  async getTimeline(applicationId: string) {
    return this.prisma.activityLog.findMany({
      where: { entity: 'APPLICATION', entityId: applicationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async submitApplication(userId: string) {
    try {
      const draft = await this.prisma.application.findFirst({
        where: {
          userId,
          status: 'DRAFT',
        },
        include: {
          profile: true,
        },
      });

      if (!draft) {
        throw new NotFoundException('Draft not found');
      }

      // 🧠 Validation قبل الإرسال (مهم جداً)
      if (!draft.profile?.fullNameAr || !draft.profile?.nationalId) {
        throw new BadRequestException('Profile is incomplete');
      }

      return await this.prisma.application.update({
        where: { id: draft.id },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('submitApplication ERROR:', error);

      throw new InternalServerErrorException({
        message: 'Failed to submit application',
        details: error?.message,
      });
    }
  }
}
