// libs/domain/profiles/src/lib/dto/create-profile.dto.ts
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  fullNameAr: string;

  @IsString()
  fullNameEn: string;

  @IsString()
  nationalId: string;

  @IsString()
  specialization: string;

  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear())
  graduationYear: number;

  @IsString()
  university: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
