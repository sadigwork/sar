import { ApiProperty } from '@nestjs/swagger';
import { ApplicationType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    example: 'REGISTRATION',
    enum: ['REGISTRATION', 'RENEWAL'],
  })
  @IsEnum(ApplicationType)
  type: 'REGISTRATION' | 'RENEWAL';

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  level?: string;
}
