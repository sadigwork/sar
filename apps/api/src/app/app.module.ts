import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../../../../libs/infrastructure/prisma/src/lib/prisma.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../../../libs/infrastructure/prisma/src/lib/prisma.module';
import { AuthModule } from '../../../../libs/domain/auth/src/lib/auth.module';
// import { AuthModule } from '@sacrs/domain/auth';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
