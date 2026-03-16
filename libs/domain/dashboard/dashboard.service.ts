// libs/domain/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/index';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // ========== مؤشرات عامة (KPI Cards) ==========
  async stats() {
    const users = await this.prisma.user.count();
    const profiles = await this.prisma.profile.count();
    const applications = await this.prisma.application.count();
    const approvedApplications = await this.prisma.application.count({
      where: { status: 'APPROVED' },
    });
    const rejectedApplications = await this.prisma.application.count({
      where: { status: 'REJECTED' },
    });
    const pendingApplications = await this.prisma.application.count({
      where: { status: 'SUBMITTED' },
    });
    const revenue = await this.prisma.payment.aggregate({
      _sum: { amount: true },
    });

    return {
      users,
      profiles,
      applications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      totalRevenue: revenue._sum.amount ?? 0,
    };
  }

  // ========== تطبيقات حسب الحالة ==========
  async applicationsByStatus() {
    const result = await this.prisma.application.groupBy({
      by: ['status'],
      _count: true,
    });
    return result.map((r) => ({ status: r.status, count: r._count }));
  }

  // ========== تطبيقات شهرياً ==========
  async applicationsPerMonth() {
    const apps = await this.prisma.application.findMany({
      select: { createdAt: true },
    });
    const map: Record<string, number> = {};

    apps.forEach((a) => {
      const month = a.createdAt.toISOString().slice(0, 7); // YYYY-MM
      map[month] = (map[month] || 0) + 1;
    });

    // تحويل للـ array جاهز للـ chart
    const labels = Object.keys(map).sort();
    const data = labels.map((m) => map[m]);
    return { labels, data };
  }

  // ========== الإيرادات شهرياً ==========
  async revenuePerMonth() {
    const payments = await this.prisma.payment.findMany({
      select: { amount: true, createdAt: true },
    });
    const map: Record<string, number> = {};
    payments.forEach((p) => {
      const month = p.createdAt.toISOString().slice(0, 7);
      map[month] = (map[month] || 0) + Number(p.amount);
    });

    const labels = Object.keys(map).sort();
    const data = labels.map((m) => map[m]);
    return { labels, data };
  }

  // ========== آخر التطبيقات المقدمة ==========
  async recentApplications(limit = 10) {
    return this.prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  // ========== التطبيقات المعلقة للمراجعين ==========
  async reviewerQueue(limit = 10) {
    return this.prisma.application.findMany({
      where: { status: 'SUBMITTED' },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  // ========== التطبيقات المدفوعة للمحاسبين ==========
  async accountantQueue(limit = 10) {
    return this.prisma.payment.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: { application: { include: { user: true } } },
    });
  }
}
