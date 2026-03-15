import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty()
  @IsString()
  degree: string;

  @ApiProperty()
  @IsString()
  field: string;

  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNumber()
  year: number;
}
