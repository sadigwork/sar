import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  isCurrent: boolean;
}
