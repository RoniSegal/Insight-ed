import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service for OpenAI integration
 * 
 * Provides methods for calling OpenAI APIs
 * For MVP, this service is configured but not actively used
 * (questions come directly from files, not from AI)
 */
@Injectable()
export class OpenAIService implements OnModuleInit {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY', '');
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview');
    this.maxTokens = this.configService.get<number>('OPENAI_MAX_TOKENS', 2000);
    this.temperature = this.configService.get<number>('OPENAI_TEMPERATURE', 0.7);
  }

  async onModuleInit() {
    if (this.isConfigured()) {
      this.logger.log(
        `OpenAI configured with model: ${this.model}, max_tokens: ${this.maxTokens}, temperature: ${this.temperature}`
      );
      this.logger.log('OpenAI Service initialized successfully');
    } else {
      this.logger.warn('OpenAI API key not configured - service will operate in limited mode');
    }
  }

  /**
   * Check if OpenAI is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('sk-');
  }

  /**
   * Get the configured model name
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Get the configured max tokens
   */
  getMaxTokens(): number {
    return this.maxTokens;
  }

  /**
   * Get the configured temperature
   */
  getTemperature(): number {
    return this.temperature;
  }
}

