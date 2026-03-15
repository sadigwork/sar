import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewDecision } from '@prisma/client';

export class ReviewApplicationDto {
  @ApiProperty({ enum: ReviewDecision })
  @IsEnum(ReviewDecision)
  decision: ReviewDecision;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
