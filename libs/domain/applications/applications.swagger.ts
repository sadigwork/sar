// libs/domain/applications/src/lib/applications.swagger.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  ApplicationStatus,
  ApplicationType,
} from './entities/application.entity';

export class ApplicationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  profileId: string;

  @ApiProperty({ enum: ApplicationType })
  type: ApplicationType;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateApplicationSwaggerDto {
  @ApiProperty({ enum: ApplicationType })
  type: ApplicationType;
}
