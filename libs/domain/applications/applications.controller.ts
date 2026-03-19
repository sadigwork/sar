import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/src/lib/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/src/lib/guards/roles.guard';
import { Roles } from '../auth/src/lib/guards/roles.decorator';
import { StageGuard } from './guards/stage.guard';
import { RoleGuard } from './guards/role.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PaymentMethod } from '../payments/index';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ApplicationDto } from './applications.swagger';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly appService: ApplicationsService) {}

  @Get('me')
  async getMyApplications(@Req() req) {
    return this.appService.getMyApplications(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, type: ApplicationDto })
  async findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new application' })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ status: 201, type: ApplicationDto })
  async create(@Req() req, @Body() dto: CreateApplicationDto) {
    // تحقق من اكتمال الملف الشخصي قبل إنشاء الطلب
    const profile = await this.appService.getUserProfile(req.user.id);
    if (!profile || profile.status !== 'APPROVED') {
      throw new BadRequestException(
        'Cannot create application before completing profile',
      );
    }
    return this.appService.createApplication(req.user.id, dto);
  }
  @Get()
  @ApiOperation({ summary: 'Get my applications' })
  @ApiResponse({ status: 200, type: [ApplicationDto] })
  findAll(@Req() req) {
    return this.appService.findAll(req.user.id);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.appService.updateApplication(req.user.id, id, dto);
  }

  @Post(':id/submit')
  async submit(@Req() req, @Param('id') id: string) {
    return this.appService.submitApplication(req.user.id, id);
  }

  // ===== Admin / Reviewer routes =====
  // @Get('submitted/all')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'reviewer')
  // async submittedApplications() {
  //   return this.appService.getSubmittedApplications();
  // }

  // الإدارة والمراجعة
  @Get('submitted')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  findSubmitted() {
    return this.appService.findSubmitted();
  }

  @Post(':id/review')
  @UseGuards(StageGuard, new RoleGuard(['REGISTRAR', 'REVIEWER', 'ACCOUNTANT']))
  reviewApplication(@Param('id') id: string, @Body() body: any) {
    return this.appService.reviewApplication(
      id,
      body.reviewerId,
      body.decision,
      body.comment,
    );
  }

  // ===== Payments =====
  @Post(':id/pay')
  async pay(
    @Param('id') id: string,
    @Req() req,
    @Body('amount') amount: number,
    @Body('method') method: PaymentMethod,
  ) {
    return this.appService.submitPayment(id, req.user.id, amount, method);
  }

  @Patch('payments/:id/verify')
  @UseGuards(RolesGuard)
  @Roles('admin', 'accountant', 'finance_manager')
  async verifyPayment(
    @Param('id') paymentId: string,
    @Body('approve') approve: boolean,
  ) {
    return this.appService.verifyPayment(paymentId, 'SYSTEM', approve);
  }
}
