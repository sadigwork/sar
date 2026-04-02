import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/src/lib/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/src/lib/guards/roles.guard';
import { Roles } from '../auth/src/lib/guards/roles.decorator';
import { StageGuard } from './guards/stage.guard';
import { RoleGuard } from './guards/role.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { PaymentMethod } from '../payments/index';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ApplicationDto,
  CreateApplicationSwaggerDto,
} from './applications.swagger';
import { ReviewDto, PaymentDto } from '../workflow/workflow.swagger';
import { BadRequestException } from '@nestjs/common';

@ApiTags('🧾 Applications Workflow')
@ApiBearerAuth()
@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly appService: ApplicationsService) {}

  // =========================
  // GET ALL
  // =========================
  @Get('me')
  @ApiOperation({ summary: 'Get my applications' })
  @ApiResponse({ status: 200, type: [ApplicationDto] })
  async getMyApplications(@Req() req) {
    return this.appService.getMyApplications(req.user.sub);
  }

  @Get('my-draft')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user draft applications',
    description:
      'Retrieves all draft applications for the authenticated user, optionally filtered by application type',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['REGISTRATION', 'RENEWAL', 'UPGRADE'],
    description: 'Filter applications by type (الحالة: DRAFT)',
    example: 'REGISTRATION',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of draft applications successfully',
    type: [ApplicationResponseDto], // استخدام DTO مناسب
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have permission',
  })
  async getMyDraft(@Req() req, @Query('type') type: string) {
    console.log(req.user);
    const userId = req.user.sub;

    const draft = await this.appService.getMyDraft(userId, type);

    if (!draft) {
      return {
        success: true,
        data: null,
      };
    }

    return draft;
  }

  @Post('draft')
  async getOrCreateDraft(@Req() req) {
    return this.appService.getOrCreateDraft(req.user.sub);
  }

  // =========================
  // GET ONE
  // =========================
  @Get(':id')
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
    const profile = await this.appService.getUserProfile(req.user.sub);
    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    return this.appService.createApplication(req.user.sub, {
      ...dto,
      profileId: profile.id,
    });
  }

  // =========================
  // UPDATE (SAVE STEP)
  // =========================
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: { step: string; data: any },
  ) {
    console.log('USER FROM REQ:', req.user);
    console.log('PARAM ID:', id);
    console.log('BODY:', dto);
    return this.appService.updateApplication(req.user.sub, id, dto);
  }

  // =========================
  // STEP UPDATE
  // =========================
  @Patch(':id/step')
  async updateStep(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: { step: string; data: any },
  ) {
    console.log('USER FROM REQ:', req.user);
    console.log('STEP:', step);
    console.log('BODY:', dto);
    return this.appService.updateStep(req.user.sub, id, dto);
  }

  // =========================
  // SUBMIT
  // =========================
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
    return this.appService.submitApplication(req.user.sub, id);
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
      body.userId,
      body.decision,
      body.comment,
    );
  }

  // ===== Payments =====
  // =========================
  // PAY
  // =========================

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
    return this.appService.submitPayment(id, req.user.sub, amount, method);
  }

  // =========================
  // VERIFY PAYMENT
  // =========================
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
    return this.appService.verifyPayment(paymentId, approve);
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
