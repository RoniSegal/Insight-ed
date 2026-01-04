/**
 * Tests for OpenAI service
 *
 * Tests that verify:
 * - isOpenAIConfigured() correctly identifies valid and invalid API keys
 * - Placeholder keys are properly detected
 * - Fallback mode is triggered when API key is invalid
 */

import { isOpenAIConfigured } from '@/app/api/lib/openai';

describe('OpenAI Service - Configuration Validation', () => {
  const originalEnv = process.env.OPENAI_API_KEY;

  afterEach(() => {
    // Restore original environment
    process.env.OPENAI_API_KEY = originalEnv;
  });

  describe('isOpenAIConfigured()', () => {
    it('should return false when API key is not set', () => {
      delete process.env.OPENAI_API_KEY;
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false when API key is empty string', () => {
      process.env.OPENAI_API_KEY = '';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false when API key does not start with sk-', () => {
      process.env.OPENAI_API_KEY = 'invalid-key-format';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for sk-proj-PLACEHOLDER', () => {
      process.env.OPENAI_API_KEY = 'sk-proj-PLACEHOLDER';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for sk-proj-PLACEHOLDER-replace-with-real-key-on-day-2', () => {
      process.env.OPENAI_API_KEY = 'sk-proj-PLACEHOLDER-replace-with-real-key-on-day-2';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys containing "replace"', () => {
      process.env.OPENAI_API_KEY = 'sk-replace-this-key';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys containing "here"', () => {
      process.env.OPENAI_API_KEY = 'sk-your-api-key-here';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys containing "your-"', () => {
      process.env.OPENAI_API_KEY = 'sk-your-openai-api-key';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys containing "example"', () => {
      process.env.OPENAI_API_KEY = 'sk-example-key-1234567890';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys containing "test-key"', () => {
      process.env.OPENAI_API_KEY = 'sk-test-key-1234567890';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys that are too short (< 40 characters)', () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return false for keys with placeholder patterns (case-insensitive)', () => {
      process.env.OPENAI_API_KEY = 'sk-PLACEHOLDER-abc123def456ghi789jkl012';
      expect(isOpenAIConfigured()).toBe(false);

      process.env.OPENAI_API_KEY = 'sk-RePlAcE-abc123def456ghi789jkl012';
      expect(isOpenAIConfigured()).toBe(false);
    });

    it('should return true for valid-looking OpenAI API key', () => {
      // Simulate a real OpenAI key format (sk- + 48 characters)
      process.env.OPENAI_API_KEY = 'sk-abc123def456ghi789jkl012mno345pqr678stu901vwx234';
      expect(isOpenAIConfigured()).toBe(true);
    });

    it('should return true for valid sk-proj- key that is not a placeholder', () => {
      // Real sk-proj- keys are ~50+ characters and don't contain placeholder words
      process.env.OPENAI_API_KEY =
        'sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567';
      expect(isOpenAIConfigured()).toBe(true);
    });

    it('should return true for minimum length valid key (40+ chars, no placeholders)', () => {
      process.env.OPENAI_API_KEY = 'sk-0123456789abcdefghijklmnopqrstuvwxyz0';
      expect(isOpenAIConfigured()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined environment gracefully', () => {
      const originalEnv = process.env;
      // @ts-ignore - Testing edge case
      process.env = {};
      expect(isOpenAIConfigured()).toBe(false);
      process.env = originalEnv;
    });

    it('should handle whitespace in key', () => {
      process.env.OPENAI_API_KEY = '  sk-abc123def456ghi789jkl012mno345pqr678stu901vwx234  ';
      // Current implementation doesn't trim - should return false due to leading space
      expect(isOpenAIConfigured()).toBe(false);
    });
  });
});
