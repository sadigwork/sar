import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, ApplicationType } from '@prisma/client';

export class ApplicationResponseDto {
  @ApiProperty({
    example: 'c6d3b4b2-9c1a-4f4a-90f2-4e1e3c7e11a',
  })
  id: string;

  @ApiProperty({
    example: 'user_123456',
  })
  userId: string;

  @ApiProperty({
    example: 'profile_123456',
  })
  profileId: string;

  @ApiProperty({
    enum: ApplicationType,
    example: 'NEW_REGISTRATION',
  })
  type: ApplicationType;

  @ApiProperty({
    enum: ApplicationStatus,
    example: 'DRAFT',
  })
  status: ApplicationStatus;

  @ApiProperty({
    example: '2026-03-20T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-20T10:00:00.000Z',
  })
  updatedAt: Date;
}
