import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../../../../libs/infrastructure/prisma/src/lib/prisma.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../../../libs/infrastructure/prisma/src/lib/prisma.module';
import { AuthModule } from '../../../../libs/domain/auth/src/lib/auth.module';
// import { AuthModule } from '@sacrs/domain/auth';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
