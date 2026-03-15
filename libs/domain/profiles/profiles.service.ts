// libs/domain/profiles/src/lib/profiles.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitProfileDto } from './dto/submit-profile.dto';
import { ProfileStatus } from './entities/profile.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      // إذا لم يوجد ملف شخصي، نعيد كائن فارغ مع إمكانية إنشائه لاحقاً
      return { exists: false, message: 'Profile not found' };
    }

    return profile;
  }

  async create(userId: string, createProfileDto: CreateProfileDto) {
    // التحقق من عدم وجود ملف شخصي مسبق
    const existing = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Profile already exists');
    }

    // إنشاء ملف شخصي جديد
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        ...createProfileDto,
        status: ProfileStatus.DRAFT,
      },
    });

    return profile;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // لا يمكن تحديث ملف تم تقديمه أو قيد المراجعة
    if (
      profile.status !== ProfileStatus.DRAFT &&
      profile.status !== ProfileStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Cannot update profile in ${profile.status} status`,
      );
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...updateProfileDto,
        // إعادة الحالة إلى DRAFT إذا كان مرفوضاً وتم التحديث
        status:
          profile.status === ProfileStatus.REJECTED
            ? ProfileStatus.DRAFT
            : profile.status,
        updatedAt: new Date(),
      },
    });

    return updatedProfile;
  }

  async submitForReview(userId: string, submitDto: SubmitProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Please create your profile first');
    }

    // التحقق من اكتمال البيانات المطلوبة
    const requiredFields = [
      'fullNameAr',
      'fullNameEn',
      'nationalId',
      'specialization',
      'graduationYear',
      'university',
    ];

    const missingFields = requiredFields.filter((field) => !profile[field]);

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    // تقديم للمراجعة
    const submittedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        status: ProfileStatus.SUBMITTED,
        submittedAt: new Date(),
        reviewNotes: submitDto.notes,
      },
    });

    return {
      message: 'Profile submitted for review successfully',
      profile: submittedProfile,
    };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and GIF files are allowed',
      );
    }

    // التحقق من الحجم (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('File size cannot exceed 2MB');
    }

    // إنشاء مسار الصورة
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    // تحديث الملف الشخصي بالصورة الجديدة
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: { avatar: avatarUrl },
      create: {
        userId,
        avatar: avatarUrl,
        fullNameAr: '',
        fullNameEn: '',
        nationalId: '',
        specialization: '',
        graduationYear: new Date().getFullYear(),
        university: '',
        status: ProfileStatus.DRAFT,
      },
    });

    return {
      avatarUrl,
      profile,
    };
  }

  // دوال الإدارة
  async findSubmittedProfiles() {
    return this.prisma.profile.findMany({
      where: {
        status: {
          in: [ProfileStatus.SUBMITTED, ProfileStatus.UNDER_REVIEW],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async reviewProfile(id: string, status: string, notes?: string) {
    const validStatuses = [ProfileStatus.APPROVED, ProfileStatus.REJECTED];

    if (!validStatuses.includes(status as ProfileStatus)) {
      throw new BadRequestException('Invalid status');
    }

    const profile = await this.prisma.profile.update({
      where: { id },
      data: {
        status: status as ProfileStatus,
        reviewedAt: new Date(),
        reviewNotes: notes,
      },
    });

    return {
      message: `Profile ${status.toLowerCase()} successfully`,
      profile,
    };
  }
}
