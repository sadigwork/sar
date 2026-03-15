import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationStatus, ApplicationType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/src/index';
import { Roles } from '@sacrs/profiles/lib/roles.enum';
import { RolesGuard } from '../auth/src/index';
import { Request } from 'express';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req: Request, @Body('type') type: ApplicationType) {
    const userId = req.user['id'];
    return this.applicationsService.createApplication(userId, type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myApplications(@Req() req: Request) {
    const userId = req.user['id'];
    return this.applicationsService.getUserApplications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.applicationsService.getApplicationById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.applicationsService.updateApplicationStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.applicationsService.deleteApplication(id);
  }
}
