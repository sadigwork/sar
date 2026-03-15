import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../../../libs/infrastructure/prisma/src/index';
import { AuthModule } from '../../../../libs/domain/auth/src/lib/auth.module';
import { ProfilesModule } from '../../../../libs/domain/profiles/index';
import { ApplicationsModule } from '../../../../libs/domain/applications/applications.module';
// import { AuthModule } from '@sacrs/domain/auth';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    ApplicationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
