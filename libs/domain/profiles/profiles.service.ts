import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitProfileDto } from './dto/submit-profile.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { ProfileStatus } from './entities/profile.entity';
import { calculateExperienceDuration } from './utils/date.util';
import { classifyUser } from './utils/classify.util';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // GET MY PROFILE
  // =========================

  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
        educations: true,
        experiences: true,
        documents: true,
        applications: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const completion = this.calculateCompletion(profile);

    return {
      ...profile,
      completion,
    };
  }

  // =========================
  // CREATE PROFILE
  // =========================

  async create(userId: string, dto: CreateProfileDto) {
    const existing = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Profile already exists');
    }

    return this.prisma.profile.create({
      data: {
        userId,
        ...dto,
        status: ProfileStatus.DRAFT,
      },
    });
  }

  // =========================
  // UPDATE PROFILE
  // =========================

  async update(userId: string, dto: UpdateProfileDto) {
    console.log('Updating profile for userId:', userId, 'with dto:', dto);
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    console.log('Current profile status:', profile.status);

    if (
      profile.status !== ProfileStatus.DRAFT &&
      profile.status !== ProfileStatus.REJECTED &&
      profile.status !== ProfileStatus.SUBMITTED
    ) {
      throw new BadRequestException(
        `Cannot update profile in ${profile.status} status`,
      );
    }

    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
        status:
          profile.status === ProfileStatus.REJECTED
            ? ProfileStatus.DRAFT
            : profile.status,
        updatedAt: new Date(),
      },
    });
  }

  // =========================
  // ADD EDUCATION
  // =========================

  async addEducation(userId: string, dto: CreateEducationDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.education.create({
      data: {
        profileId: profile.id,
        ...dto,
      },
    });
  }

  // =========================
  // ADD EXPERIENCE
  // =========================

  async addExperience(userId: string, dto: CreateExperienceDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // ❌ validation منطقي
    if (dto.isCurrent && dto.endDate) {
      throw new BadRequestException('End date must be null if current job');
    }

    if (!dto.isCurrent && !dto.endDate) {
      throw new BadRequestException('End date is required if not current job');
    }

    const start = new Date(dto.startDate);
    const end = dto.endDate ? new Date(dto.endDate) : null;

    if (end && end < start) {
      throw new BadRequestException('End date must be after start date');
    }
    // ✅ حساب المدة
    const duration = calculateExperienceDuration(dto.startDate, dto.endDate);

    return this.prisma.experience.create({
      data: {
        profileId: profile.id,
        company: dto.company,
        position: dto.position,
        startDate: dto.startDate,
        endDate: dto.endDate,
        isCurrent: dto.isCurrent,
        years: duration.years,
        months: duration.months,
      },
    });
  }

  // =========================
  // SUBMIT PROFILE
  // =========================

  async submitForReview(userId: string, dto: SubmitProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        educations: true,
        experiences: true,
        documents: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Please create your profile first');
    }

    const completion = this.calculateCompletion(profile);

    if (completion < 80) {
      throw new BadRequestException(
        `Profile completion must be at least 80%. Current completion: ${completion}%`,
      );
    }

    const requiredFields = [
      'fullNameAr',
      'fullNameEn',
      'nationalId',
      'specialization',
      'graduationYear',
      'university',
    ];

    const missing = requiredFields.filter((f) => !profile[f]);

    if (missing.length) {
      throw new BadRequestException(
        `Missing required fields: ${missing.join(', ')}`,
      );
    }

    return this.prisma.profile.update({
      where: { userId },
      data: {
        status: ProfileStatus.SUBMITTED,
        submittedAt: new Date(),
        reviewNotes: dto.notes,
      },
    });
  }

  // =========================
  // ADMIN: GET SUBMITTED
  // =========================

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

  // =========================
  // ADMIN: GET ONE
  // =========================

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: true,
        educations: true,
        experiences: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  // =========================
  // ADMIN REVIEW
  // =========================

  async reviewProfile(id: string, status: string, notes?: string) {
    const valid = [ProfileStatus.APPROVED, ProfileStatus.REJECTED];

    if (!valid.includes(status as ProfileStatus)) {
      throw new BadRequestException('Invalid status');
    }

    return this.prisma.profile.update({
      where: { id },
      data: {
        status: status as ProfileStatus,
        reviewedAt: new Date(),
        reviewNotes: notes,
      },
    });
  }
  private calculateCompletion(profile: any): number {
    let score = 0;

    // ======================
    // Personal Info (40%)
    // ======================

    const personalFields = [
      'fullNameAr',
      'fullNameEn',
      'nationalId',
      'specialization',
      'graduationYear',
      'university',
    ];

    const filledPersonal = personalFields.filter((f) => profile[f]);
    const personalScore = (filledPersonal.length / personalFields.length) * 40;

    score += personalScore;

    // ======================
    // Education (20%)
    // ======================

    if (profile.educations && profile.educations.length > 0) {
      score += 20;
    }

    // ======================
    // Experience (20%)
    // ======================

    if (profile.experiences && profile.experiences.length > 0) {
      score += 20;
    }

    // ======================
    // Documents (20%)
    // ======================

    if (profile.documents && profile.documents.length > 0) {
      score += 20;
    }

    return Math.round(score);
  }

  async getTotalExperience(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        experiences: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const totalMonths = profile.experiences.reduce((sum, exp) => {
      return sum + (exp.years * 12 + exp.months);
    }, 0);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return {
      years,
      months,
      totalMonths,
    };
  }

  async getProfileIntelligence(userId: string) {
    const totalExp = await this.getTotalExperience(userId);
    const completion = await this.getProfileCompletion(userId);
    const level = classifyUser(totalExp.years);

    return {
      experience: totalExp,
      level,
      completion,
    };
  }
  async getUserLevelsStats() {
    const profiles = await this.prisma.profile.findMany({
      include: { experiences: true },
    });

    const stats = {
      Junior: 0,
      'Mid-Level': 0,
      Senior: 0,
      Expert: 0,
    };

    for (const profile of profiles) {
      const totalMonths = profile.experiences.reduce((sum, exp) => {
        return sum + (exp.years * 12 + exp.months);
      }, 0);

      const years = Math.floor(totalMonths / 12);
      const level = classifyUser(years);

      stats[level]++;
    }

    return stats;
  }

  async getProfileCompletion(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        experiences: true,
        educations: true,
        documents: true,
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    let score = 0;

    // basic info
    if (profile.user?.firstName && profile.user?.lastName) score += 20;

    // profile
    if (profile.fullNameAr && profile.fullNameEn) score += 20;

    // experience
    if (profile.experiences.length > 0) score += 30;

    // education
    if (profile.educations.length > 0) score += 20;

    // documents
    if (profile.documents.length > 0) score += 10;

    return {
      completion: score,
      isComplete: score === 100,
    };
  }
}
