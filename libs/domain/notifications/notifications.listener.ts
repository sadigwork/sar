import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../infrastructure/prisma/src/index';

@Injectable()
export class NotificationsListener {
  constructor(
    private notifications: NotificationsService,
    private prisma: PrismaService,
  ) {}

  // 🔁 تغيير المرحلة
  @OnEvent('workflow.stage.changed')
  async handleStageChange(event: any) {
    const app = await this.prisma.application.findUnique({
      where: { id: event.applicationId },
    });

    if (!app) return;

    await this.notifications.create({
      userId: app.userId,
      title: 'Application Progress Updated',
      message: `Your application moved to ${event.payload.to}`,
      type: 'WORKFLOW',
      metadata: event.payload,
    });
  }

  // ❌ رفض
  @OnEvent('workflow.rejected')
  async handleRejected(event: any) {
    const app = await this.prisma.application.findUnique({
      where: { id: event.applicationId },
    });

    if (!app) return;

    await this.notifications.createNotification({
      userId: app.userId,
      title: 'Application Rejected',
      message: 'Your application has been rejected',
      type: 'WORKFLOW',
    });
  }

  // 🎉 موافقة نهائية
  @OnEvent('workflow.completed')
  async handleApproved(event: any) {
    const app = await this.prisma.application.findUnique({
      where: { id: event.applicationId },
    });

    if (!app) return;

    await this.notifications.createNotification({
      userId: app.userId,
      title: 'Application Approved 🎉',
      message: 'Congratulations! Your application is approved.',
      type: 'WORKFLOW',
    });
  }
}
