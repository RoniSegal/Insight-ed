import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

/**
 * Service for managing AI prompts used in student analysis.
 *
 * This service provides access to system prompts, question templates, and analysis prompts
 * used by the ChatGPT integration to analyze student learning profiles.
 *
 * Phase 1: Prompts are loaded from text files for easy editing and better Hebrew encoding.
 * Phase 2 (future): Prompts will be stored in database with versioning and A/B testing support.
 *
 * @example
 * ```typescript
 * const systemPrompt = promptsService.getSystemPrompt('David Cohen');
 * const questions = promptsService.getQuestionTemplates();
 * const analysisPrompt = promptsService.getAnalysisPrompt();
 * ```
 */
@Injectable()
export class PromptsService implements OnModuleInit {
  private readonly logger = new Logger(PromptsService.name);
  /**
   * Path to the templates directory
   * Resolves to either src/prompts/templates (dev) or dist/src/prompts/templates (production)
   * @private
   */
  private readonly TEMPLATES_DIR = this.resolveTemplatesDir();

  /**
   * Question templates used to gather information about the student.
   * Loaded from templates/questions.txt at initialization.
   * @private
   */
  private QUESTION_TEMPLATES: string[];

  /**
   * Analysis prompt template used after gathering all responses.
   * Loaded from templates/analysis-prompt.txt at initialization.
   * @private
   */
  private SYSTEM_PROMPT_TEMPLATE: string;

  /**
   * Resolve the templates directory path.
   * Works in both development (src/) and production (dist/) environments.
   * @private
   */
  private resolveTemplatesDir(): string {
    // Try compiled path first (production)
    const compiledPath = join(__dirname, 'templates');
    if (existsSync(compiledPath)) {
      return compiledPath;
    }

    // Fall back to source path (development with ts-node or nest start --watch)
    // __dirname in dev points to src/prompts, so templates are in ./templates
    const devPath1 = join(__dirname, 'templates');
    if (existsSync(devPath1)) {
      return devPath1;
    }

    // Another fallback for different dev setups
    const devPath2 = join(process.cwd(), 'src/prompts/templates');
    if (existsSync(devPath2)) {
      return devPath2;
    }

    // If neither exists, use compiled path and let the error be descriptive
    return compiledPath;
  }

  /**
   * Lifecycle hook called when the module initializes.
   * Loads all prompt templates from text files.
   */
  onModuleInit() {
    this.logger.log('Loading prompt templates from files...');
    try {
      this.SYSTEM_PROMPT_TEMPLATE = this.loadTemplate('analysis-prompt.txt');

      // Split questions by question number (lines starting with digit followed by period)
      const questionsContent = this.loadTemplate('questions.txt');
      this.QUESTION_TEMPLATES = questionsContent
        .split(/(?=^\d+\.\s)/m) // Split before lines starting with "1. ", "2. ", etc.
        .map((question) => question.trim())
        .filter((question) => question.length > 0 && /^\d+\./.test(question));

      this.logger.log(`Successfully loaded ${this.QUESTION_TEMPLATES.length} question templates`);
    } catch (error) {
      this.logger.error('Failed to load prompt templates', error);
      throw error;
    }
  }

  /**
   * Load a template file from the templates directory.
   * @param filename - Name of the template file to load
   * @returns The content of the template file as UTF-8 string
   * @private
   */
  private loadTemplate(filename: string): string {
    const filePath = join(this.TEMPLATES_DIR, filename);
    this.logger.debug(`Loading template from: ${filePath}`);
    return readFileSync(filePath, 'utf-8');
  }

  /**
   * Get the system prompt with student name interpolated.
   * This prompt sets the context for the AI conversation.
   *
   * @param studentName - The name of the student being analyzed
   * @returns The system prompt with the student's name inserted
   *
   * @example
   * ```typescript
   * const prompt = promptsService.getSystemPrompt('Sarah Levi');
   * // Returns: "You are an expert educational psychologist... [student: Sarah Levi]"
   * ```
   */
  getSystemPrompt(studentName: string): string {
    return this.interpolateVariables(this.SYSTEM_PROMPT_TEMPLATE, { studentName });
  }

  /**
   * Get the list of question templates to ask about the student.
   * These questions are asked sequentially during the analysis session.
   *
   * @returns Array of 6 Hebrew question templates
   *
   * @example
   * ```typescript
   * const questions = promptsService.getQuestionTemplates();
   * // Returns: ['מה הביצועים האקדמיים...', ...]
   * ```
   */
  getQuestionTemplates(): string[] {
    return [...this.QUESTION_TEMPLATES];
  }

  /**
   * Get the analysis prompt template.
   * This prompt is used after all questions have been answered to generate
   * the final comprehensive analysis report.
   *
   * @returns The analysis prompt template in Hebrew
   *
   * @example
   * ```typescript
   * const analysisPrompt = promptsService.getAnalysisPrompt();
   * // Returns: "בהתבסס על כל המידע שנאסף..."
   * ```
   */
  getAnalysisPrompt(): string {
    return this.SYSTEM_PROMPT_TEMPLATE;
  }

  /**
   * Get the system prompt template (alias for getAnalysisPrompt).
   * @returns The analysis prompt template in Hebrew
   */
  getSystemPromptTemplate(): string {
    return this.SYSTEM_PROMPT_TEMPLATE;
  }

  /**
   * Interpolate variables in a template string.
   * Replaces placeholders like {variableName} with actual values.
   *
   * @param template - The template string with placeholders
   * @param variables - Object containing variable names and their values
   * @returns The template with variables replaced
   * @private
   *
   * @example
   * ```typescript
   * interpolateVariables('Hello {name}!', { name: 'John' })
   * // Returns: "Hello John!"
   * ```
   */
  private interpolateVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    return result;
  }
}
