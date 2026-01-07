import { Module } from '@nestjs/common';

import { OpenAIModule } from '../openai/openai.module';
import { PromptsModule } from '../prompts/prompts.module';

import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

/**
 * Analysis Module
 *
 * Provides REST API endpoints for student analysis workflow:
 * - Starting analysis conversations
 * - Continuing conversations with AI
 * - Completing analyses and generating reports
 * - Retrieving saved analysis results
 *
 * Dependencies:
 * - OpenAIModule - For AI-powered conversation
 * - PromptsModule - For system prompts and question templates
 *
 * @module AnalysisModule
 */
@Module({
  imports: [OpenAIModule, PromptsModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
