import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status with timestamp and service name', () => {
      const result = service.getHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('service', 'growth-engine-backend');
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
    });
  });
});
