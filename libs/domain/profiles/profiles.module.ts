import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import {
  PrismaModule,
  PrismaService,
} from '../../infrastructure/prisma/src/index';
import { UsersService } from '../users';

@Module({
  imports: [PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, UsersService, PrismaService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
