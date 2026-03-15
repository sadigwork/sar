import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/index';
import { ApplicationStatus, ApplicationType } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  /** إنشاء طلب جديد بناء على ملف المستخدم */
  async createApplication(userId: string, type: ApplicationType) {
    // تأكد أن المستخدم لديه profile
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new BadRequestException('Profile not found. You must create a profile first.');
    }

    const application = await this.prisma.application.create({
      data: {
        userId,
        profileId: profile.id,
        type,
        status: ApplicationStatus.DRAFT,
      },
    });

    return application;
  }

  /** جلب جميع التطبيقات لمستخدم معين */
  async getUserApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        profile: true,
        reviews: true,
        documents: true,
        payments: true,
      },
    });
  }

  /** جلب تطبيق واحد */
  async getApplicationById(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { profile: true, reviews: true, documents: true, payments: true },
    });

    if (!app) throw new NotFoundException('Application not found');

    return app;
  }

  /** تحديث حالة التطبيق (workflow) */
  async updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    const app = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return app;
  }

  /** حذف التطبيق */
  async deleteApplication(applicationId: string) {
    await this.prisma.application.delete({
      where: { id: applicationId },
    });

    return { message: 'Application deleted successfully' };
  }
}