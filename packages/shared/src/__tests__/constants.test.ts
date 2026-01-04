import { API_ERROR_CODES, PAGINATION_DEFAULTS, ANALYSIS_SETTINGS } from '../constants';

describe('Shared Constants', () => {
  describe('API_ERROR_CODES', () => {
    it('should have VALIDATION_ERROR code', () => {
      expect(API_ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    });

    it('should have UNAUTHORIZED code', () => {
      expect(API_ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
    });

    it('should have FORBIDDEN code', () => {
      expect(API_ERROR_CODES.FORBIDDEN).toBe('FORBIDDEN');
    });

    it('should have NOT_FOUND code', () => {
      expect(API_ERROR_CODES.NOT_FOUND).toBe('NOT_FOUND');
    });

    it('should have DUPLICATE_RESOURCE code', () => {
      expect(API_ERROR_CODES.DUPLICATE_RESOURCE).toBe('DUPLICATE_RESOURCE');
    });

    it('should have RATE_LIMIT_EXCEEDED code', () => {
      expect(API_ERROR_CODES.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('should have OPENAI_API_ERROR code', () => {
      expect(API_ERROR_CODES.OPENAI_API_ERROR).toBe('OPENAI_API_ERROR');
    });

    it('should have INTERNAL_ERROR code', () => {
      expect(API_ERROR_CODES.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    });

    it('should be readonly', () => {
      // TypeScript const assertion ensures this, but we verify the object structure
      expect(Object.keys(API_ERROR_CODES)).toHaveLength(8);
    });
  });

  describe('PAGINATION_DEFAULTS', () => {
    it('should have PAGE default of 1', () => {
      expect(PAGINATION_DEFAULTS.PAGE).toBe(1);
    });

    it('should have LIMIT default of 20', () => {
      expect(PAGINATION_DEFAULTS.LIMIT).toBe(20);
    });

    it('should have MAX_LIMIT of 100', () => {
      expect(PAGINATION_DEFAULTS.MAX_LIMIT).toBe(100);
    });

    it('should have all expected properties', () => {
      expect(Object.keys(PAGINATION_DEFAULTS)).toEqual(['PAGE', 'LIMIT', 'MAX_LIMIT']);
    });
  });

  describe('ANALYSIS_SETTINGS', () => {
    it('should have MAX_QUESTIONS of 6', () => {
      expect(ANALYSIS_SETTINGS.MAX_QUESTIONS).toBe(6);
    });

    it('should have MAX_DURATION_MINUTES of 15', () => {
      expect(ANALYSIS_SETTINGS.MAX_DURATION_MINUTES).toBe(15);
    });

    it('should have MAX_TOKENS of 2000', () => {
      expect(ANALYSIS_SETTINGS.MAX_TOKENS).toBe(2000);
    });

    it('should have all expected properties', () => {
      expect(Object.keys(ANALYSIS_SETTINGS)).toEqual([
        'MAX_QUESTIONS',
        'MAX_DURATION_MINUTES',
        'MAX_TOKENS',
      ]);
    });
  });
});
