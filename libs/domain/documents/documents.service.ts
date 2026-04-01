import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/src/lib/prisma.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { validateFileByType } from './utils/document-validation.util';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    dto: UploadDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // 🔍 Validate file type
    validateFileByType(file, dto.type);

    // 🔒 Validate profile
    if (dto.profileId) {
      const profile = await this.prisma.profile.findUnique({
        where: { id: dto.profileId },
      });

      if (!profile || profile.userId !== userId) {
        throw new BadRequestException('Invalid profile');
      }
    }

    // 🔒 Validate application
    if (dto.applicationId) {
      const app = await this.prisma.application.findUnique({
        where: { id: dto.applicationId },
      });

      if (!app || app.userId !== userId) {
        throw new BadRequestException('Invalid application');
      }
    }

    // 🚫 Prevent duplicate NATIONAL_ID
    if (dto.type === 'NATIONAL_ID') {
      const existing = await this.prisma.document.findFirst({
        where: {
          userId,
          type: 'NATIONAL_ID',
        },
      });

      if (existing) {
        throw new BadRequestException('National ID already uploaded');
      }
    }

    return this.prisma.document.create({
      data: {
        userId,
        profileId: dto.profileId || undefined,
        applicationId: dto.applicationId || undefined,
        type: dto.type,
        fileUrl: `/uploads/documents/${file.filename}`,
        status: 'PENDING',
      },
    });
  }

  async getMyDocuments(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(id: string, userId: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    if (doc.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }

  async reviewDocument(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.document.update({
      where: { id },
      data: { status },
    });
  }
}
