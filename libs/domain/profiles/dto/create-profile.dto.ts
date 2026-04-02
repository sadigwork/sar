import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ProfileExample } from '../../../common/swagger/examples';

export class CreateProfileDto {
  @ApiProperty({ example: ProfileExample.fullNameAr })
  @IsString()
  fullNameAr: string;

  @ApiProperty({ example: ProfileExample.fullNameEn })
  @IsString()
  fullNameEn: string;

  @ApiProperty({ example: ProfileExample.nationalId })
  @IsString()
  nationalId: string;

  @ApiProperty({ example: ProfileExample.phone })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: ProfileExample.dateOfBirth })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: ProfileExample.gender })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: ProfileExample.address })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: ProfileExample.city })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: ProfileExample.country })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: ProfileExample.bio })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: ProfileExample.specialization })
  @IsString()
  specialization: string;

  @ApiProperty({ example: ProfileExample.graduationYear })
  @IsNumber()
  graduationYear: number;

  @ApiProperty({ example: ProfileExample.university })
  @IsString()
  university: string;
}
