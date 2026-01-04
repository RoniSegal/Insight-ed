import { Module } from '@nestjs/common';

import { PromptsService } from './prompts.service';

/**
 * PromptsModule provides prompt management services for the student analysis system.
 *
 * This module encapsulates all AI prompt logic, including:
 * - System prompts that define the AI's role
 * - Question templates for gathering student information
 * - Analysis prompts for generating comprehensive reports
 *
 * The module is designed to be imported by any feature that needs access to prompts,
 * such as the student analysis API or admin prompt management.
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [PromptsModule],
 *   // ...
 * })
 * export class AnalysisModule {}
 * ```
 */
@Module({
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
