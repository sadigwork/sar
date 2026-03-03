import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule as DomainUsersModule } from '../../../../libs/domain/profile/src/index';

@Module({
  imports: [DomainUsersModule],
  controllers: [UsersController],
})
export class UsersModule {}
