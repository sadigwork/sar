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
import {
  ApplicationDto,
  CreateApplicationSwaggerDto,
} from './applications.swagger';
import { ReviewDto, PaymentDto } from '../workflow/workflow.swagger';

@ApiTags('🧾 Applications Workflow')
@ApiBearerAuth()
@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly appService: ApplicationsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my applications' })
  @ApiResponse({ status: 200, type: [ApplicationDto] })
  async getMyApplications(@Req() req) {
    return this.appService.getMyApplications(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, type: ApplicationDto })
  async getApplicationById(@Param('id') id: string, @Req() req) {
    return this.appService.getApplicationById(id, req.user.sub);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Application',
    description: 'إنشاء طلب جديد (الحالة: DRAFT)',
  })
  @ApiBody({ type: CreateApplicationSwaggerDto })
  @ApiResponse({ status: 201, type: ApplicationDto })
  async create(@Req() req, @Body() dto: CreateApplicationDto) {
    // تحقق من اكتمال الملف الشخصي قبل إنشاء الطلب
    const profile = await this.appService.getUserProfile(req.user.id);
    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    // if (profile.status !== 'APPROVED') {
    //   throw new BadRequestException(
    //     'Cannot create application before profile approval',
    //   );
    // }
    return this.appService.createApplication(req.user.id, {
      ...dto,
      profileId: profile.id,
    });
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: { step: string; data: UpdateApplicationDto },
  ) {
    return this.appService.updateApplication(req.user.sub, id, dto);
  }

  @ApiOperation({
    summary: 'Submit Application',
    description: `
  إرسال الطلب للمراجعة

  الحالة:
  DRAFT → SUBMITTED
  `,
  })
  @Post(':id/submit')
  async submit(@Req() req, @Param('id') id: string) {
    return this.appService.submitApplication(req.user.id, id);
  }

  // الإدارة والمراجعة
  @Get('submitted')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  findSubmitted() {
    return this.appService.findSubmitted();
  }

  @Post(':id/review')
  @ApiOperation({
    summary: 'Review Application',
    description: `
  يقوم المراجع باتخاذ قرار

  الحالات:
  UNDER_REVIEW → APPROVED / REJECTED
  `,
  })
  @ApiBody({ type: ReviewDto })
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
  @ApiOperation({
    summary: 'Submit Payment',
    description: `
  دفع رسوم الطلب

  الحالة:
  APPROVED → PAYMENT_PENDING
  `,
  })
  @ApiBody({ type: PaymentDto })
  async pay(
    @Param('id') id: string,
    @Req() req,
    @Body('amount') amount: number,
    @Body('method') method: PaymentMethod,
  ) {
    return this.appService.submitPayment(id, req.user.id, amount, method);
  }

  @Patch('payments/:id/verify')
  @ApiOperation({
    summary: 'Verify Payment',
    description: `
  يقوم المحاسب بتأكيد الدفع

  الحالة:
  PAYMENT_PENDING → COMPLETED
  `,
  })
  @ApiBody({
    schema: {
      example: {
        approve: true,
      },
    },
  })
  @UseGuards(RolesGuard)
  @Roles('admin', 'accountant', 'finance_manager')
  async verifyPayment(
    @Param('id') paymentId: string,
    @Body('approve') approve: boolean,
  ) {
    return this.appService.verifyPayment(paymentId, 'SYSTEM', approve);
  }

  @Post(':id/action')
  @UseGuards(JwtAuthGuard)
  async performAction(
    @Param('id') id: string,
    @Body() body: { action: string },
    @Req() req,
  ) {
    return this.appService.performAction(id, req.user, body.action);
  }
}
