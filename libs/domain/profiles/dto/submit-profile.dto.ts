import { IsOptional, IsString } from 'class-validator';

// libs/domain/profiles/src/lib/dto/submit-profile.dto.ts
export class SubmitProfileDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
