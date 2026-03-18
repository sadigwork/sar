import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Mustagbal Org' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Technical Manager' })
  @IsString()
  position: string;

  @ApiProperty({ example: '2007-03-18' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2009-03-18', required: false })
  @IsOptional()
  @ValidateIf((o) => !o.isCurrent) // ❌ لا يُسمح إذا isCurrent = true
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  endDate?: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  isCurrent: boolean;
}
