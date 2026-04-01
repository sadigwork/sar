import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, ApplicationType } from '@prisma/client';

export class ApplicationResponseDto {
  @ApiProperty({
    description: 'Application unique identifier',
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
    description: 'Type of application',
    enum: ['REGISTRATION', 'RENEWAL', 'UPGRADE'],
    example: 'REGISTRATION',
  })
  type: ApplicationType;

  @ApiProperty({
    description: 'Current status of the application',
    enum: [
      'DRAFT',
      'SUBMITTED',
      'REGISTRAR_REVIEW',
      'REVIEWER_REVIEW',
      'APPROVED',
      'REJECTED',
    ],
    example: 'DRAFT',
  })
  status: ApplicationStatus;

  @ApiProperty({
    description: 'Current review stage',
    enum: [
      'REGISTRAR_REVIEW',
      'REVIEWER_REVIEW',
      'FINANCE_REVIEW',
      'ADMIN_REVIEW',
    ],
    required: false,
    example: 'REGISTRAR_REVIEW',
    nullable: true,
  })
  currentStage: string | null;

  @ApiProperty({
    description: 'Date when the application was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the application was submitted',
    required: false,
    example: '2024-01-20T14:45:00Z',
    nullable: true,
  })
  submittedAt: Date | null;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-22T09:15:00Z',
  })
  updatedAt: Date;
}
