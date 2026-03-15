import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitProfileDto {
  @ApiProperty({
    description: 'Optional notes when submitting profile',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
