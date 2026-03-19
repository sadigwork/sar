import { BadRequestException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';

export function validateFileByType(
  file: Express.Multer.File,
  type: DocumentType,
) {
  const mime = file.mimetype;

  switch (type) {
    case 'PHOTO':
      if (!mime.startsWith('image/')) {
        throw new BadRequestException('Photo must be an image');
      }
      break;

    case 'DEGREE':
    case 'LICENSE':
      if (!mime.includes('pdf')) {
        throw new BadRequestException('File must be PDF');
      }
      break;

    case 'NATIONAL_ID':
      if (!mime.startsWith('image/')) {
        throw new BadRequestException('National ID must be image');
      }
      break;
  }
}
