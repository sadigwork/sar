// libs/domain/applications/src/lib/entities/application.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, ApplicationType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ApplicationEntity {
  @ApiProperty({ description: 'Application ID' })
  id: string;

  @ApiProperty({ description: 'ID of the user who owns this application' })
  userId: string;

  @ApiProperty({
    description: 'ID of the profile associated with this application',
  })
  profileId: string;

  @ApiProperty({ enum: ApplicationType })
  @IsEnum(ApplicationType)
  type: ApplicationType;

  @ApiProperty({ enum: ApplicationStatus, default: ApplicationStatus.DRAFT })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiProperty({ description: 'Creation date', type: String })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date', type: String })
  updatedAt: Date;

  @ApiProperty({ description: 'Optional comment or note', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
