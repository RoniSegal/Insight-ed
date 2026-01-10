import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import {
  GeminiAuthenticationException,
  GeminiCircuitBreakerException,
  GeminiConfigurationException,
  GeminiException,
  GeminiRateLimitException,
  GeminiServiceException,
} from '../../gemini/exceptions/gemini.exception';
import { ChatMessage } from '../../gemini/interfaces/chat.interface';
import { GeminiService } from '../../gemini/gemini.service';

// Mock @google/genai SDK
jest.mock('@google/genai');

describe('GeminiService', () => {
  let service: GeminiService;
  let configService: ConfigService;
  let mockGeminiClient: any;

  const mockValidApiKey = 'AIzaSy' + 'B'.repeat(35); // Valid format (39 chars)
  const mockMessages: ChatMessage[] = [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Hello' },
  ];

  beforeEach(async () => {
    // Create mock Gemini client instance
    mockGeminiClient = {
      models: {
        generateContent: jest.fn(),
      },
    };

    // Mock GoogleGenAI constructor
    const { GoogleGenAI } = require('@google/genai');
    (GoogleGenAI as jest.Mock).mockImplementation(() => mockGeminiClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                GEMINI_API_KEY: mockValidApiKey,
                GEMINI_MODEL: 'gemini-2.5-flash',
                GEMINI_MAX_TOKENS: 2000,
                GEMINI_TEMPERATURE: 0.7,
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
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
          GeminiService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => 'invalid-key'),
            },
          },
        ],
      }).compile();

      const invalidService = invalidModule.get<GeminiService>(GeminiService);
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
          GeminiService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => ''),
            },
          },
        ],
      }).compile();

      return newModule.then(async (module) => {
        const testService = module.get<GeminiService>(GeminiService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });

    it('should return false if API key contains placeholder text', () => {
      const placeholders = [
        'placeholder-key',
        'replace-me',
        'your-key-here',
        'example-key',
        'test-key',
      ];

      placeholders.forEach(async (placeholder) => {
        const newModule = await Test.createTestingModule({
          providers: [
            GeminiService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn(() => placeholder),
              },
            },
          ],
        }).compile();

        const testService = newModule.get<GeminiService>(GeminiService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });

    it('should return false if API key is too short', () => {
      const newModule = Test.createTestingModule({
        providers: [
          GeminiService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => 'short'),
            },
          },
        ],
      }).compile();

      return newModule.then(async (module) => {
        const testService = module.get<GeminiService>(GeminiService);
        testService.onModuleInit();
        expect(testService.isConfigured()).toBe(false);
      });
    });
  });

  describe('chat - Success Cases', () => {
    it('should successfully send a chat request', async () => {
      const mockResponse = {
        text: 'Hello! How can I help you?',
        usageMetadata: {
          promptTokenCount: 10,
          candidatesTokenCount: 20,
          totalTokenCount: 30,
        },
      };

      mockGeminiClient.models.generateContent.mockResolvedValue(mockResponse);

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
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat(mockMessages);

      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash',
          config: expect.objectContaining({
            maxOutputTokens: 2000,
            temperature: 0.7,
            systemInstruction: 'You are helpful',
          }),
        })
      );
    });

    it('should override default configuration with options', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat(mockMessages, {
        model: 'gemini-2.5-pro',
        maxTokens: 1000,
        temperature: 0.5,
      });

      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-pro',
          config: expect.objectContaining({
            maxOutputTokens: 1000,
            temperature: 0.5,
          }),
        })
      );
    });

    it('should handle response without usage data', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
      });

      const result = await service.chat(mockMessages);

      expect(result).toEqual({
        message: 'Response',
        usage: undefined,
      });
    });

    it('should log token usage when available', async () => {
      const loggerSpy = jest.spyOn((service as any).logger, 'log');

      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 200, totalTokenCount: 300 },
      });

      await service.chat(mockMessages);

      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Gemini API Call'));
      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('100 tokens'));
      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('200 tokens'));
    });

    it('should correctly convert message roles for Gemini API', async () => {
      const messagesWithAssistant: ChatMessage[] = [
        { role: 'system', content: 'System instruction' },
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' },
      ];

      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat(messagesWithAssistant);

      // Verify system message is passed as systemInstruction
      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            systemInstruction: 'System instruction',
          }),
          contents: expect.arrayContaining([
            expect.objectContaining({ role: 'user' }),
            expect.objectContaining({ role: 'model' }), // assistant -> model
            expect.objectContaining({ role: 'user' }),
          ]),
        })
      );
    });
  });

  describe('chat - Error Handling', () => {
    it('should throw GeminiConfigurationException if not configured', async () => {
      const newModule = await Test.createTestingModule({
        providers: [
          GeminiService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => ''),
            },
          },
        ],
      }).compile();

      const testService = newModule.get<GeminiService>(GeminiService);
      testService.onModuleInit();

      await expect(testService.chat(mockMessages)).rejects.toThrow(GeminiConfigurationException);
    });

    it('should throw GeminiAuthenticationException on 401 error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 401,
        message: 'Invalid API key',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiAuthenticationException);
    });

    it('should throw GeminiAuthenticationException on 403 error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 403,
        message: 'Permission denied',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiAuthenticationException);
    });

    it('should throw GeminiAuthenticationException on API key error message', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue(
        new Error('API key not valid. Please pass a valid API key.')
      );

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiAuthenticationException);
    });

    it('should throw GeminiRateLimitException on 429 error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 429,
        message: 'Rate limit exceeded',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiRateLimitException);
    });

    it('should throw GeminiRateLimitException on quota exceeded message', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue(
        new Error('Resource exhausted: quota exceeded')
      );

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiRateLimitException);
    });

    it('should throw GeminiServiceException on 500 error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 500,
        message: 'Internal server error',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiServiceException);
    });

    it('should throw GeminiServiceException on 502 error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 502,
        message: 'Bad gateway',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiServiceException);
    });

    it('should throw GeminiServiceException on 503 error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 503,
        message: 'Service unavailable',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiServiceException);
    });

    it('should throw GeminiException for other errors', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 400,
        message: 'Bad request',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiException);
    });

    it('should throw GeminiException if no message in response', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: null,
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiException);
    });
  });

  describe('chat - Retry Logic', () => {
    it('should retry on transient errors', async () => {
      mockGeminiClient.models.generateContent
        .mockRejectedValueOnce({ status: 500, message: 'Server error' })
        .mockResolvedValueOnce({
          text: 'Success on retry',
          usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
        });

      const result = await service.chat(mockMessages);

      expect(result.message).toBe('Success on retry');
      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledTimes(2);
    });

    it('should not retry on authentication errors', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 401,
        message: 'Invalid API key',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiAuthenticationException);
      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledTimes(1);
    });

    it('should exhaust retries and throw last error', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiServiceException);
      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });
  });

  describe('chat - Circuit Breaker', () => {
    beforeEach(() => {
      // Reset circuit breaker state before each test
      (service as any).circuitBreakerFailures = 0;
      (service as any).circuitBreakerOpenUntil = null;
    });

    it('should open circuit breaker after threshold failures', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
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
      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiCircuitBreakerException);
    });

    it('should reset circuit breaker on successful request', async () => {
      // Manually set some failures (below threshold)
      (service as any).circuitBreakerFailures = 5;
      (service as any).circuitBreakerOpenUntil = null;

      // Succeed once - this should reset the circuit breaker
      mockGeminiClient.models.generateContent.mockResolvedValueOnce({
        text: 'Success',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
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
      expect(() => (service as any).checkCircuitBreaker()).toThrow(GeminiCircuitBreakerException);

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
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat([]);

      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: [],
        })
      );
    });

    it('should handle very long messages', async () => {
      const longMessage = { role: 'user' as const, content: 'A'.repeat(10000) };

      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat([longMessage]);

      expect(mockGeminiClient.models.generateContent).toHaveBeenCalled();
    });

    it('should handle Hebrew characters in messages', async () => {
      const hebrewMessages: ChatMessage[] = [
        { role: 'system', content: 'אתה עוזר' },
        { role: 'user', content: 'שלום' },
      ];

      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'שלום! איך אני יכול לעזור?',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      const result = await service.chat(hebrewMessages);

      expect(result.message).toContain('שלום');
    });

    it('should handle temperature of 0 (deterministic)', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat(mockMessages, { temperature: 0 });

      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            temperature: 0,
          }),
        })
      );
    });

    it('should handle temperature of 2 (maximum randomness)', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
      });

      await service.chat(mockMessages, { temperature: 2 });

      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            temperature: 2,
          }),
        })
      );
    });

    it('should handle network timeout errors', async () => {
      // Reset circuit breaker state
      (service as any).circuitBreakerFailures = 0;
      (service as any).circuitBreakerOpenUntil = null;

      mockGeminiClient.models.generateContent.mockRejectedValue({
        message: 'Network timeout',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiException);
    }, 10000);

    it('should handle messages without system instruction', async () => {
      const messagesWithoutSystem: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Hi!',
        usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 2, totalTokenCount: 7 },
      });

      const result = await service.chat(messagesWithoutSystem);

      expect(result.message).toBe('Hi!');
      expect(mockGeminiClient.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            systemInstruction: undefined,
          }),
        })
      );
    });

    it('should handle usage metadata with undefined token counts', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: {
          promptTokenCount: undefined,
          candidatesTokenCount: undefined,
          totalTokenCount: undefined,
        },
      });

      const result = await service.chat(mockMessages);

      expect(result).toEqual({
        message: 'Response',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      });
    });

    it('should handle usage metadata with null token counts', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: {
          promptTokenCount: null,
          candidatesTokenCount: null,
          totalTokenCount: null,
        },
      });

      const result = await service.chat(mockMessages);

      expect(result).toEqual({
        message: 'Response',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      });
    });

    it('should handle usage metadata with zero token counts', async () => {
      mockGeminiClient.models.generateContent.mockResolvedValue({
        text: 'Response',
        usageMetadata: {
          promptTokenCount: 0,
          candidatesTokenCount: 0,
          totalTokenCount: 0,
        },
      });

      const result = await service.chat(mockMessages);

      expect(result).toEqual({
        message: 'Response',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      });
    });

    it('should handle error with httpStatusCode field', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        httpStatusCode: 401,
        message: 'Unauthorized',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiAuthenticationException);
    });

    it('should handle error with nested response.status field', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue({
        response: { status: 429 },
        message: 'Too many requests',
      });

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiRateLimitException);
    });

    it('should handle non-Error objects in error handling', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue('String error');

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiException);
    });

    it('should handle permission error messages', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue(
        new Error('Permission denied for this resource')
      );

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiAuthenticationException);
    });

    it('should handle rate limit error messages', async () => {
      mockGeminiClient.models.generateContent.mockRejectedValue(
        new Error('Rate limit exceeded, please retry later')
      );

      await expect(service.chat(mockMessages)).rejects.toThrow(GeminiRateLimitException);
    });
  });

  describe('Exception Classes', () => {
    it('should create GeminiException with custom status', () => {
      const exception = new GeminiException('Test error', 400);
      expect(exception.message).toBe('Test error');
      expect(exception.getStatus()).toBe(400);
      expect(exception.name).toBe('GeminiException');
    });

    it('should create GeminiException with default status', () => {
      const exception = new GeminiException('Test error');
      expect(exception.getStatus()).toBe(500);
    });

    it('should create GeminiAuthenticationException with default message', () => {
      const exception = new GeminiAuthenticationException();
      expect(exception.message).toBe('Invalid Gemini API key configuration');
      expect(exception.getStatus()).toBe(401);
      expect(exception.name).toBe('GeminiAuthenticationException');
    });

    it('should create GeminiAuthenticationException with custom message', () => {
      const exception = new GeminiAuthenticationException('Custom auth error');
      expect(exception.message).toBe('Custom auth error');
    });

    it('should create GeminiRateLimitException with default message', () => {
      const exception = new GeminiRateLimitException();
      expect(exception.message).toBe('Gemini rate limit exceeded. Please try again in a moment.');
      expect(exception.getStatus()).toBe(429);
      expect(exception.name).toBe('GeminiRateLimitException');
    });

    it('should create GeminiRateLimitException with custom message', () => {
      const exception = new GeminiRateLimitException('Custom rate limit error');
      expect(exception.message).toBe('Custom rate limit error');
    });

    it('should create GeminiServiceException with default message', () => {
      const exception = new GeminiServiceException();
      expect(exception.message).toBe(
        'Gemini service is temporarily unavailable. Please try again.'
      );
      expect(exception.getStatus()).toBe(503);
      expect(exception.name).toBe('GeminiServiceException');
    });

    it('should create GeminiServiceException with custom message', () => {
      const exception = new GeminiServiceException('Custom service error');
      expect(exception.message).toBe('Custom service error');
    });

    it('should create GeminiConfigurationException with default message', () => {
      const exception = new GeminiConfigurationException();
      expect(exception.message).toBe('Gemini API is not properly configured');
      expect(exception.getStatus()).toBe(500);
      expect(exception.name).toBe('GeminiConfigurationException');
    });

    it('should create GeminiConfigurationException with custom message', () => {
      const exception = new GeminiConfigurationException('Custom config error');
      expect(exception.message).toBe('Custom config error');
    });

    it('should create GeminiCircuitBreakerException with default message', () => {
      const exception = new GeminiCircuitBreakerException();
      expect(exception.message).toBe(
        'Gemini service is temporarily unavailable due to repeated failures'
      );
      expect(exception.getStatus()).toBe(503);
      expect(exception.name).toBe('GeminiCircuitBreakerException');
    });

    it('should create GeminiCircuitBreakerException with custom message', () => {
      const exception = new GeminiCircuitBreakerException('Custom circuit breaker error');
      expect(exception.message).toBe('Custom circuit breaker error');
    });
  });
});
