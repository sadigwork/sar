// libs/domain/dashboard/dashboard.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.service.stats();
  }

  @Get('applications/status')
  getApplicationsStatus() {
    return this.service.applicationsByStatus();
  }

  @Get('applications/monthly')
  getApplicationsMonthly() {
    return this.service.applicationsPerMonth();
  }

  @Get('revenue/monthly')
  getRevenueMonthly() {
    return this.service.revenuePerMonth();
  }

  @Get('recent-applications')
  getRecentApplications(@Query('limit') limit: number = 10) {
    return this.service.recentApplications(Number(limit));
  }

  @Get('reviewer-queue')
  getReviewerQueue(@Query('limit') limit: number = 10) {
    return this.service.reviewerQueue(Number(limit));
  }

  @Get('accountant-queue')
  getAccountantQueue(@Query('limit') limit: number = 10) {
    return this.service.accountantQueue(Number(limit));
  }
}
