// libs/domain/applications/src/lib/dto/applications.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  ApplicationStatus,
  ApplicationType,
} from '../entities/application.entity';

export class ApplicationDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() profileId: string;
  @ApiProperty({ enum: ApplicationType }) type: ApplicationType;
  @ApiProperty({ enum: ApplicationStatus }) status: ApplicationStatus;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class CreateApplicationDto {
  @ApiProperty({ enum: ApplicationType }) type: ApplicationType;
}
