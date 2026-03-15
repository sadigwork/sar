// libs/domain/profiles/src/lib/profiles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/src/lib/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/src/lib/guards/roles.guard';
import { Roles } from '../auth/src/lib/guards/roles.decorator';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitProfileDto } from './dto/submit-profile.dto';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // جلب الملف الشخصي للمستخدم الحالي
  @Get('me')
  async getMyProfile(@Req() req) {
    return this.profilesService.findByUserId(req.user.id);
  }

  // إنشاء ملف شخصي جديد
  @Post()
  async create(@Req() req, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(req.user.id, createProfileDto);
  }

  // تحديث الملف الشخصي
  @Patch('me')
  async update(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(req.user.id, updateProfileDto);
  }

  // تقديم الملف للمراجعة
  @Post('me/submit')
  async submitForReview(@Req() req, @Body() submitDto: SubmitProfileDto) {
    return this.profilesService.submitForReview(req.user.id, submitDto);
  }

  // رفع صورة شخصية
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.uploadAvatar(req.user.id, file);
  }

  // ===== مسارات الإدارة (للمراجعين والمشرفين) =====

  // جلب جميع الملفات المقدمة للمراجعة
  @Get('submitted')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  async getSubmittedProfiles() {
    return this.profilesService.findSubmittedProfiles();
  }

  // جلب ملف شخصي محدد (للمراجعة)
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  async findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  // مراجعة ملف شخصي
  @Patch(':id/review')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  async reviewProfile(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.profilesService.reviewProfile(id, status, notes);
  }
}
