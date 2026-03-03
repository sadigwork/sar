// apps/api/src/app/services/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env['NODE_ENV'] === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Disconnected from database');
  }
  async cleanDatabase() {
    if (process.env['NODE_ENV'] === 'production') return;
    // محو قاعدة البيانات للتطوير (اختياري)
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
