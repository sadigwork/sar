// libs/domain/dashboard/dashboard.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardExamples } from '@common/swagger/examples';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('stats')
  @ApiResponse({
    status: 200,
    description: 'KPI Stats',
    examples: DashboardExamples.stats,
  })
  getStats() {
    return this.service.stats();
  }

  @Get('applications/status')
  @ApiResponse({
    status: 200,
    description: 'Applications grouped by status',
    examples: DashboardExamples.applicationsByStatus,
  })
  getApplicationsStatus() {
    return this.service.applicationsByStatus();
  }

  @Get('applications/monthly')
  @ApiResponse({
    status: 200,
    description: 'Applications per month chart',
    examples: DashboardExamples.applicationsPerMonth,
  })
  getApplicationsMonthly() {
    return this.service.applicationsPerMonth();
  }

  @Get('revenue/monthly')
  @ApiResponse({
    status: 200,
    description: 'Applications per month chart',
    examples: DashboardExamples.applicationsPerMonth,
  })
  getRevenueMonthly() {
    return this.service.revenuePerMonth();
  }

  @Get('recent-applications')
  @ApiResponse({
    status: 200,
    description: 'Last submitted applications',
    examples: DashboardExamples.recentApplications,
  })
  getRecentApplications(@Query('limit') limit: number = 10) {
    return this.service.recentApplications(Number(limit));
  }

  @Get('reviewer-queue')
  @ApiResponse({
    status: 200,
    description: 'Applications pending review',
    examples: DashboardExamples.reviewerQueue,
  })
  getReviewerQueue(@Query('limit') limit: number = 10) {
    return this.service.reviewerQueue(Number(limit));
  }

  @Get('accountant-queue')
  @ApiResponse({
    status: 200,
    description: 'Pending payments',
    examples: DashboardExamples.accountantQueue,
  })
  getAccountantQueue(@Query('limit') limit: number = 10) {
    return this.service.accountantQueue(Number(limit));
  }
}
