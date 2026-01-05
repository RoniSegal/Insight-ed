import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

/**
 * PrismaModule - Global database module
 *
 * Marked as @Global() so PrismaService is available to all modules
 * without needing to import this module everywhere
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
