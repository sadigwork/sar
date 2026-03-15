// libs/domain/profiles/src/lib/profiles.swagger.ts
import { ApiProperty } from '@nestjs/swagger';
import { ProfileStatus } from './entities/profile.entity';

export class ProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullNameAr: string;

  @ApiProperty()
  fullNameEn: string;

  @ApiProperty()
  nationalId: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ enum: ProfileStatus })
  status: ProfileStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateProfileSwaggerDto {
  @ApiProperty()
  fullNameAr: string;

  @ApiProperty()
  fullNameEn: string;

  @ApiProperty()
  nationalId: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  bio?: string;
}

export class UpdateProfileSwaggerDto extends CreateProfileSwaggerDto {}
