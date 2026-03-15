import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../../users/index';

export class RegisterDto {
  @ApiProperty({
    example: 'adam.sadig@example.com',
    description: 'The email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Sadig', description: 'The first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Adam', description: 'The last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.USER,
    description: 'User role (optional)',
  })
  @IsOptional()
  @IsEnum(Role)
  role: string;
}
