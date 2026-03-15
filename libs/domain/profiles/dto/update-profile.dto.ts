// libs/domain/profiles/src/lib/dto/update-profile.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  // يمكن إضافة حقول خاصة بالتحديث هنا
  status?: string;
}
