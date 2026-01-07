import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Centralized database connection
 *
 * Extends PrismaClient to provide:
 * - Single database connection instance across the app
 * - Proper connection lifecycle (connect on init, disconnect on destroy)
 * - Graceful shutdown handling
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
