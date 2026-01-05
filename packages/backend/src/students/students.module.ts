import { Module } from '@nestjs/common';

import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

/**
 * Students Module
 *
 * Provides student management functionality:
 * - Create, read, update, delete students
 * - In-memory storage for MVP (will migrate to Prisma)
 * - JWT authentication required for all endpoints
 */
@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
