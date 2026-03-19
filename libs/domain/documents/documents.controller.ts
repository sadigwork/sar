import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { multerConfig } from '../../infrastructure/upload/multer.config';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Req() req,
  ) {
    return this.documentsService.uploadDocument(req.user.id, file, dto);
  }

  @Get('me')
  getMyDocuments(@Req() req) {
    return this.documentsService.getMyDocuments(req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.documentsService.deleteDocument(id, req.user.id);
  }

  // Admin endpoint
  @Post(':id/review')
  review(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.documentsService.reviewDocument(id, status);
  }
}
