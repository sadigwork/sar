import { ApiProperty } from '@nestjs/swagger';
import { ApplicationType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    enum: ApplicationType,
    example: 'NEW_REGISTRATION',
    description: 'Type of application',
  })
  @IsEnum(ApplicationType)
  type: ApplicationType;
}
