import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/src';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getMy(@Req() req) {
    return this.notificationsService.findMyNotifications(req.user.sub);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  markAll(@Req() req) {
    // تعليم جميع إشعارات المستخدم الحالي كمقروءة
    return this.notificationsService.markAll(req.user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreateNotificationDto) {
    return this.notificationsService.create(
      createDto.userId,
      createDto.title,
      createDto.message,
      createDto.type,
      createDto.entity,
      createDto.entityId,
    );
  }
}
