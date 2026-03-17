import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env['NODE_ENV'] === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });

    if (process.env.NODE_ENV !== 'production') {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = this;
      }
      return globalForPrisma.prisma;
    }
  }

  async onModuleInit() {
    await this.$connect();
    if (process.env['NODE_ENV'] === 'development') {
      console.log('✅ Prisma connected to DB');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (process.env['NODE_ENV'] === 'development') {
      console.log('🛑 Prisma disconnected from DB');
    }
  }
}
