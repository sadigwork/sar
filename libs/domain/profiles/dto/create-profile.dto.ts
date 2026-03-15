import { ApiProperty } from '@nestjs/swagger';
import { ProfileExample } from '../../../common/swagger/examples';

export class CreateProfileDto {
  @ApiProperty({ example: ProfileExample.fullNameAr })
  fullNameAr: string;

  @ApiProperty({ example: ProfileExample.fullNameEn })
  fullNameEn: string;

  @ApiProperty({ example: ProfileExample.nationalId })
  nationalId: string;

  @ApiProperty({ example: ProfileExample.phone })
  phone?: string;

  @ApiProperty({ example: ProfileExample.dateOfBirth })
  dateOfBirth?: string;

  @ApiProperty({ example: ProfileExample.gender })
  gender?: string;

  @ApiProperty({ example: ProfileExample.address })
  address?: string;

  @ApiProperty({ example: ProfileExample.city })
  city?: string;

  @ApiProperty({ example: ProfileExample.country })
  country?: string;

  @ApiProperty({ example: ProfileExample.bio })
  bio?: string;
}
