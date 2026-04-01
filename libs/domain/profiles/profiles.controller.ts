import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ProfilesService } from './profiles.service';

import { JwtAuthGuard } from '../auth/src/lib/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/src/lib/guards/roles.guard';
import { Roles } from '../auth/src/lib/guards/roles.decorator';
import { SubmitProfileDto } from './dto/submit-profile.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';

import { FileInterceptor } from '@nestjs/platform-express';

// إضافة Swagger decorators
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileDto } from './profiles.swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../auth/src/index';

@ApiTags('👤 Profile Setup')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiResponse({ status: 200, type: ProfileDto })
  async getMyProfile(@CurrentUser() user) {
    return this.profilesService.getMyProfile(user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, type: ProfileDto })
  create(@Req() req, @Body() dto: CreateProfileDto) {
    return this.profilesService.create(req.user.sub, dto);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile' })
  @ApiResponse({ status: 200, type: ProfileDto })
  update(@Req() req, @Body() dto: UpdateProfileDto) {
    if (dto.dateOfBirth) {
      dto.dateOfBirth = new Date(dto.dateOfBirth) as any;
    }
    return this.profilesService.update(req.user.sub, dto);
  }

  @Post('me/submit')
  @ApiOperation({ summary: 'Submit profile for review' })
  @ApiResponse({ status: 200, type: ProfileDto })
  submit(@Req() req, @Body() dto: SubmitProfileDto) {
    return this.profilesService.submitForReview(req.user.sub, dto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.uploadAvatar(req.user.sub, file);
  }

  @Post('education')
  addEducation(@Req() req, @Body() dto: CreateEducationDto) {
    return this.profilesService.addEducation(req.user.sub, dto);
  }

  @Post('experience')
  addExperience(@Req() req, @Body() dto: CreateExperienceDto) {
    console.log('BODY:', dto);
    return this.profilesService.addExperience(req.user.sub, dto);
  }

  // ===== ADMIN =====

  @Get('submitted')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  findSubmitted() {
    return this.profilesService.findSubmittedProfiles();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id/review')
  @UseGuards(RolesGuard)
  @Roles('admin', 'reviewer')
  review(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.profilesService.reviewProfile(id, status, notes);
  }

  @Get('intelligence')
  getProfileIntelligence(@Req() req) {
    return this.profilesService.getProfileIntelligence(req.user.sub);
  }

  @Get('dashboard/levels')
  async userLevels() {
    return this.profilesService.getUserLevelsStats();
  }
}
