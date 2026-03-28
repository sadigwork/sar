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

  @ApiProperty({
    example: 'clx123-profile-id',
    description: 'Profile ID المرتبط بالمستخدم',
  })
  profileId: string;

  @ApiProperty({ enum: ApplicationType, example: 'NEW_REGISTRATION' })
  type: ApplicationType;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateApplicationSwaggerDto {
  @ApiProperty({
    enum: ['REGISTRATION', 'RENEWAL'],
    example: 'REGISTRATION',
  })
  type: string;
}
