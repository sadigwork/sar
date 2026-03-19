import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { WorkflowService } from '../workflow/index';
import { PrismaModule } from '../../infrastructure/prisma/src/index';

@Module({
  imports: [PrismaModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, WorkflowService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
