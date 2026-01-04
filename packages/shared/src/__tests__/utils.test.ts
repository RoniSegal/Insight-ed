import { formatDate, generateId, sleep } from '../utils';

describe('Shared Utils', () => {
  describe('formatDate', () => {
    it('should format a date to ISO date string', () => {
      const date = new Date('2024-03-15T12:30:45.000Z');
      expect(formatDate(date)).toBe('2024-03-15');
    });

    it('should handle dates at midnight', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      expect(formatDate(date)).toBe('2024-01-01');
    });

    it('should handle dates at end of day', () => {
      const date = new Date('2024-12-31T23:59:59.999Z');
      expect(formatDate(date)).toBe('2024-12-31');
    });

    it('should handle leap year dates', () => {
      const date = new Date('2024-02-29T10:00:00.000Z');
      expect(formatDate(date)).toBe('2024-02-29');
    });
  });

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should include timestamp and random parts', () => {
      const id = generateId();
      const parts = id.split('-');
      expect(parts.length).toBe(2);
      expect(parts[0]).toMatch(/^\d+$/); // timestamp is numeric
      expect(parts[1]).toMatch(/^[a-z0-9]+$/); // random is alphanumeric
    });

    it('should generate unique IDs on consecutive calls', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with proper format', () => {
      const id = generateId();
      // Pattern: timestamp-randomstring
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('sleep', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return a promise', () => {
      const result = sleep(100);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve after specified time', async () => {
      const callback = jest.fn();

      sleep(1000).then(callback);

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      await Promise.resolve();
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      await Promise.resolve();
      expect(callback).toHaveBeenCalled();
    });

    it('should resolve with undefined', async () => {
      const promise = sleep(100);
      jest.advanceTimersByTime(100);
      const result = await promise;
      expect(result).toBeUndefined();
    });

    it('should handle zero milliseconds', async () => {
      const promise = sleep(0);
      jest.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
