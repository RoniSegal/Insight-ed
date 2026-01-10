import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { GeminiModule } from '../../gemini/gemini.module';
import { GeminiService } from '../../gemini/gemini.service';

// Mock @google/genai SDK
jest.mock('@google/genai');

describe('GeminiModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        GeminiModule,
      ],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide GeminiService', () => {
    const geminiService = module.get<GeminiService>(GeminiService);
    expect(geminiService).toBeDefined();
    expect(geminiService).toBeInstanceOf(GeminiService);
  });

  it('should export GeminiService', () => {
    // GeminiService should be accessible from the module
    const geminiService = module.get<GeminiService>(GeminiService);
    expect(geminiService).toBeDefined();
  });
});
