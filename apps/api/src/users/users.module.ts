import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule as DomainUsersModule } from '../../../../libs/domain/users/index';

@Module({
  imports: [DomainUsersModule],
  controllers: [UsersController],
})
export class UsersModule {}
