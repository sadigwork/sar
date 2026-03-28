// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/index'; // افتراضاً مسار PrismaService
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  async findMyNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * إنشاء إشعار جديد
   * @param userId - معرف المستخدم
   * @param title - عنوان الإشعار
   * @param message - محتوى الإشعار
   * @param type - نوع الإشعار
   * @param entity - الكيان المرتبط (اختياري)
   * @param entityId - معرف الكيان المرتبط (اختياري)
   */
  async create(
    userId: string,
    title: string,
    message: string,
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
    entity?: string,
    entityId?: string,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        entity,
        entityId,
        read: false,
      },
    });
  }

  /**
   * تعليم إشعار واحد كمقروء
   * @param id - معرف الإشعار
   */
  async markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  /**
   * تعليم جميع إشعارات المستخدم كمقروءة
   * @param userId - معرف المستخدم
   */
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    return { count: result.count };
  }

  /**
   * تعليم جميع الإشعارات (لجميع المستخدمين) كمقروءة - للاستخدام الإداري
   */
  async markAll(): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });

    return { count: result.count };
  }

  /**
   * حذف إشعار
   * @param id - معرف الإشعار
   */
  async delete(id: string): Promise<Notification> {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * حذف جميع إشعارات المستخدم
   * @param userId - معرف المستخدم
   */
  async deleteAll(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return { count: result.count };
  }

  /**
   * الحصول على عدد الإشعارات غير المقروءة للمستخدم
   * @param userId - معرف المستخدم
   */
  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return { count };
  }
}
