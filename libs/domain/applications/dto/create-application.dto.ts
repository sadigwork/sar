import { ApiProperty } from '@nestjs/swagger';
import { ApplicationType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { ApplicationExample } from '../../../common/swagger/examples';

export class CreateApplicationDto {
  @ApiProperty({
    example: ApplicationExample.type,
    enum: ['REGISTRATION', 'RENEWAL'],
  })
  @IsEnum(ApplicationType)
  type: 'REGISTRATION' | 'RENEWAL';

  @ApiProperty({
    example: ApplicationExample.status,
    enum: ['DRAFT', 'SUBMITTED'],
  })
  status: 'DRAFT' | 'SUBMITTED';

  @ApiProperty({
    example: 'profile_id_here',
  })
  @IsString()
  profileId: string;
}
