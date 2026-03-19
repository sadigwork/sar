import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../../../libs/infrastructure/prisma/src/index';
import { AuthModule } from '../../../../libs/domain/auth/src/lib/auth.module';
import { ProfilesModule } from '../../../../libs/domain/profiles/index';
import { DashboardModule } from '../../../../libs/domain/dashboard/dashboard.module';
import { ApplicationsModule } from '../../../../libs/domain/applications/applications.module';
import { DocumentsModule } from '../../../../libs/domain/documents/index';
// import { AuthModule } from '@sacrs/domain/auth';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    ApplicationsModule,
    DashboardModule,
    DocumentsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
