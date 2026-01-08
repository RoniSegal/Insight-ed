import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { OpenAIService } from '../../openai/openai.service';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let configService: ConfigService;

  const mockValidApiKey = 'sk-' + 'a'.repeat(45); // Valid format

  beforeEach(async () => {
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
              return config[key] !== undefined ? config[key] : defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Configuration', () => {
    it('should load configuration from ConfigService', () => {
      expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY', '');
      expect(configService.get).toHaveBeenCalledWith('OPENAI_MODEL', 'gpt-4-turbo-preview');
      expect(configService.get).toHaveBeenCalledWith('OPENAI_MAX_TOKENS', 2000);
      expect(configService.get).toHaveBeenCalledWith('OPENAI_TEMPERATURE', 0.7);
    });

    it('should report as configured when API key is valid', () => {
      expect(service.isConfigured()).toBe(true);
    });

    it('should report as not configured when API key is missing', async () => {
      const moduleWithoutKey: TestingModule = await Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string, defaultValue?: any) => {
                const config: Record<string, any> = {
                  OPENAI_API_KEY: '',
                  OPENAI_MODEL: 'gpt-4-turbo-preview',
                };
                return config[key] !== undefined ? config[key] : defaultValue;
              }),
            },
          },
        ],
      }).compile();

      const serviceWithoutKey = moduleWithoutKey.get<OpenAIService>(OpenAIService);
      expect(serviceWithoutKey.isConfigured()).toBe(false);
    });

    it('should report as not configured when API key is invalid format', async () => {
      const moduleWithInvalidKey: TestingModule = await Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string, defaultValue?: any) => {
                const config: Record<string, any> = {
                  OPENAI_API_KEY: 'invalid-key',
                  OPENAI_MODEL: 'gpt-4-turbo-preview',
                };
                return config[key] !== undefined ? config[key] : defaultValue;
              }),
            },
          },
        ],
      }).compile();

      const serviceWithInvalidKey = moduleWithInvalidKey.get<OpenAIService>(OpenAIService);
      expect(serviceWithInvalidKey.isConfigured()).toBe(false);
    });
  });

  describe('Configuration Getters', () => {
    it('should return configured model', () => {
      expect(service.getModel()).toBe('gpt-4-turbo-preview');
    });

    it('should return configured max tokens', () => {
      expect(service.getMaxTokens()).toBe(2000);
    });

    it('should return configured temperature', () => {
      expect(service.getTemperature()).toBe(0.7);
    });
  });

  describe('onModuleInit', () => {
    it('should log initialization with configuration details', async () => {
      const logSpy = jest.spyOn(service['logger'], 'log');
      await service.onModuleInit();

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('OpenAI configured with model: gpt-4-turbo-preview')
      );
      expect(logSpy).toHaveBeenCalledWith('OpenAI Service initialized successfully');
    });

    it('should log warning when API key is not configured', async () => {
      const moduleWithoutKey: TestingModule = await Test.createTestingModule({
        providers: [
          OpenAIService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string, defaultValue?: any) => {
                const config: Record<string, any> = {
                  OPENAI_API_KEY: '',
                  OPENAI_MODEL: 'gpt-4-turbo-preview',
                };
                return config[key] !== undefined ? config[key] : defaultValue;
              }),
            },
          },
        ],
      }).compile();

      const serviceWithoutKey = moduleWithoutKey.get<OpenAIService>(OpenAIService);
      const warnSpy = jest.spyOn(serviceWithoutKey['logger'], 'warn');
      await serviceWithoutKey.onModuleInit();

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('OpenAI API key not configured')
      );
    });
  });
});
