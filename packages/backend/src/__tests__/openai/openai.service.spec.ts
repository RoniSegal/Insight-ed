import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import {
  OpenAIAuthenticationException,
  OpenAICircuitBreakerException,
  OpenAIConfigurationException,
  OpenAIException,
  OpenAIRateLimitException,
  OpenAIServiceException,
} from '../../openai/exceptions/openai.exception';
import { ChatMessage } from '../../openai/interfaces/chat.interface';
import { OpenAIService } from '../../openai/openai.service';

// Mock OpenAI SDK
jest.mock('openai');

describe('OpenAIService', () => {
  let service: OpenAIService;
  let configService: ConfigService;
  let mockOpenAI: any;

  const mockValidApiKey = 'sk-' + 'a'.repeat(45); // Valid format
  const mockMessages: ChatMessage[] = [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Hello' },
  ];

  beforeEach(async () => {
    // Create mock OpenAI instance
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };

    // Mock OpenAI constructor
    const OpenAI = require('openai');
    OpenAI.default = jest.fn(() => mockOpenAI);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                OPENAI_API_KEY: mockValidApiKey,
                OPENAI_MODEL: 'gpt-4-turbo-preview',
                OPENAI_MAX_TOKENS: 2000,
                OPENAI_TEMPERATURE: 0.7,
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
    configService = module.get<ConfigService>(ConfigService);

    // Initialize the service
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Reset circuit breaker state after each test
    if (service) {
      (service as any).circuitBreakerFailures = 0;
      (service as any).circuitBreakerOpenUntil = null;
    }
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize successfully with valid configuration', () => {
      expect(() => service.onModuleInit()).not.toThrow();
    });

    it('should log warning if API key is not configured', async () => {
      // Create service with invalid API key
      const invalidModule = await Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => 'invalid-key'),
            },
          },
        ],
      }).compile();

      const invalidService = invalidModule.get<OpenAIService>(OpenAIService);
      const loggerSpy = jest.spyOn((invalidService as any).logger, 'warn');

      invalidService.onModuleInit();

      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('not configured'));
    });
  });

  describe('isConfigured', () => {
    it('should return true for valid API key', () => {
      expect(service.isConfigured()).toBe(true);
    });

    it('should return false if API key is empty', () => {
      (configService.get as jest.Mock).mockReturnValue('');
      const newModule = Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => ''),
            },
          },
        ],
      }).compile();

      return newModule.then(async (module) => {
        const testService = module.get<OpenAIService>(OpenAIService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });

    it('should return false if API key does not start with sk-', () => {
      const newModule = Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => 'invalid-key-format'),
            },
          },
        ],
      }).compile();

      return newModule.then(async (module) => {
        const testService = module.get<OpenAIService>(OpenAIService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });

    it('should return false if API key contains placeholder text', () => {
      const placeholders = [
        'sk-placeholder',
        'sk-replace-me',
        'sk-your-key-here',
        'sk-example-key',
        'sk-test-key',
      ];

      placeholders.forEach(async (placeholder) => {
        const newModule = await Test.createTestingModule({
          providers: [
            OpenAIService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn(() => placeholder),
              },
            },
          ],
        }).compile();

        const testService = newModule.get<OpenAIService>(OpenAIService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });

    it('should return false if API key is too short', () => {
      const newModule = Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => 'sk-short'),
            },
          },
        ],
      }).compile();

      return newModule.then(async (module) => {
        const testService = module.get<OpenAIService>(OpenAIService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });
  });

  describe('chat - Success Cases', () => {
    it('should successfully send a chat request', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Hello! How can I help you?',
            },
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
        model: 'gpt-4-turbo-preview',
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await service.chat(mockMessages);

      expect(result).toEqual({
        message: 'Hello! How can I help you?',
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      });
    });

    it('should use default configuration values', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        model: 'gpt-4-turbo-preview',
      });

      await service.chat(mockMessages);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4-turbo-preview',
        messages: mockMessages,
        max_tokens: 2000,
        temperature: 0.7,
      });
    });

    it('should override default configuration with options', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        model: 'gpt-3.5-turbo',
      });

      await service.chat(mockMessages, {
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.5,
      });

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: mockMessages,
        max_tokens: 1000,
        temperature: 0.5,
      });
    });

    it('should handle response without usage data', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        model: 'gpt-4-turbo-preview',
      });

      const result = await service.chat(mockMessages);

      expect(result).toEqual({
        message: 'Response',
        usage: undefined,
      });
    });

    it('should log token usage when available', async () => {
      const loggerSpy = jest.spyOn((service as any).logger, 'log');

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 },
        model: 'gpt-4-turbo-preview',
      });

      await service.chat(mockMessages);

      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('OpenAI API Call'));
      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('100 tokens'));
      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('200 tokens'));
    });
  });

  describe('chat - Error Handling', () => {
    it('should throw OpenAIConfigurationException if not configured', async () => {
      const newModule = await Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => ''),
            },
          },
        ],
      }).compile();

      const testService = newModule.get<OpenAIService>(OpenAIService);
      testService.onModuleInit();

      await expect(testService.chat(mockMessages)).rejects.toThrow(OpenAIConfigurationException);
    });

    it('should throw OpenAIAuthenticationException on 401 error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 401,
        message: 'Invalid API key',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIAuthenticationException);
    });

    it('should throw OpenAIRateLimitException on 429 error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 429,
        message: 'Rate limit exceeded',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIRateLimitException);
    });

    it('should throw OpenAIServiceException on 500 error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 500,
        message: 'Internal server error',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIServiceException);
    });

    it('should throw OpenAIServiceException on 502 error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 502,
        message: 'Bad gateway',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIServiceException);
    });

    it('should throw OpenAIServiceException on 503 error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 503,
        message: 'Service unavailable',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIServiceException);
    });

    it('should throw OpenAIException for other errors', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 400,
        message: 'Bad request',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIException);
    });

    it('should throw OpenAIException if no message in response', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [],
        model: 'gpt-4-turbo-preview',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIException);
    });
  });

  describe('chat - Retry Logic', () => {
    it('should retry on transient errors', async () => {
      mockOpenAI.chat.completions.create
        .mockRejectedValueOnce({ status: 500, message: 'Server error' })
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'Success on retry' } }],
          model: 'gpt-4-turbo-preview',
        });

      const result = await service.chat(mockMessages);

      expect(result.message).toBe('Success on retry');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(2);
    });

    it('should not retry on authentication errors', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 401,
        message: 'Invalid API key',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIAuthenticationException);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    it('should exhaust retries and throw last error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIServiceException);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });
  });

  describe('chat - Circuit Breaker', () => {
    beforeEach(() => {
      // Reset circuit breaker state before each test
      (service as any).circuitBreakerFailures = 0;
      (service as any).circuitBreakerOpenUntil = null;
    });

    it('should open circuit breaker after threshold failures', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      // Trigger circuit breaker threshold (10 failures)
      for (let i = 0; i < 10; i++) {
        try {
          await service.chat(mockMessages);
        } catch (error) {
          // Expected to fail
        }
      }

      // Next request should be blocked by circuit breaker
      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAICircuitBreakerException);
    });

    it('should reset circuit breaker on successful request', async () => {
      // Manually set some failures (below threshold)
      (service as any).circuitBreakerFailures = 5;
      (service as any).circuitBreakerOpenUntil = null;

      // Succeed once - this should reset the circuit breaker
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: 'Success' } }],
        model: 'gpt-4-turbo-preview',
      });

      await service.chat(mockMessages);

      // Circuit breaker should be reset to 0
      const failures = (service as any).circuitBreakerFailures;
      expect(failures).toBe(0);
    });

    it('should reset circuit breaker after timeout', () => {
      // Manually set circuit breaker to open state
      (service as any).circuitBreakerFailures = 10;
      (service as any).circuitBreakerOpenUntil = Date.now() + 1000; // Open for 1 second

      // Circuit breaker should be open
      expect(() => (service as any).checkCircuitBreaker()).toThrow(OpenAICircuitBreakerException);

      // Simulate time passing
      (service as any).circuitBreakerOpenUntil = Date.now() - 1000; // 1 second in the past

      // Circuit breaker should now allow requests (reset)
      expect(() => (service as any).checkCircuitBreaker()).not.toThrow();

      // Failures should be reset
      expect((service as any).circuitBreakerFailures).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty messages array', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        model: 'gpt-4-turbo-preview',
      });

      await service.chat([]);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [],
        })
      );
    });

    it('should handle very long messages', async () => {
      const longMessage = { role: 'user' as const, content: 'A'.repeat(10000) };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        model: 'gpt-4-turbo-preview',
      });

      await service.chat([longMessage]);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    });

    it('should handle Hebrew characters in messages', async () => {
      const hebrewMessages: ChatMessage[] = [
        { role: 'system', content: 'אתה עוזר' },
        { role: 'user', content: 'שלום' },
      ];

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'שלום! איך אני יכול לעזור?' } }],
        model: 'gpt-4-turbo-preview',
      });

      const result = await service.chat(hebrewMessages);

      expect(result.message).toContain('שלום');
    });

    it('should handle temperature of 0 (deterministic)', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        model: 'gpt-4-turbo-preview',
      });

      await service.chat(mockMessages, { temperature: 0 });

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0,
        })
      );
    });

    it('should handle temperature of 2 (maximum randomness)', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Response' } }],
        model: 'gpt-4-turbo-preview',
      });

      await service.chat(mockMessages, { temperature: 2 });

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 2,
        })
      );
    });

    it('should handle network timeout errors', async () => {
      // Reset circuit breaker state
      (service as any).circuitBreakerFailures = 0;
      (service as any).circuitBreakerOpenUntil = null;

      mockOpenAI.chat.completions.create.mockRejectedValue({
        message: 'Network timeout',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(OpenAIException);
    }, 10000);
  });
});
