import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { UserService } from '../users/users.service';
import { use } from 'react';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
  exports: [PrismaService],
})
export class AppModule {}
