import {
  cn,
  formatDate,
  formatDateTime,
  truncate,
  getInitials,
  sleep,
  debounce,
} from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', false && 'disabled')).toBe('base active');
    });

    it('should handle Tailwind conflicts with proper precedence', () => {
      expect(cn('p-4', 'p-6')).toBe('p-6');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'extra')).toBe('base extra');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
    });

    it('should handle arrays', () => {
      expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold');
    });

    it('should handle objects', () => {
      expect(cn({ 'text-sm': true, 'text-lg': false, 'font-bold': true })).toBe(
        'text-sm font-bold'
      );
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format date with short format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'short');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/01|1/);
      expect(result).toMatch(/2024/);
    });

    it('should format date with long format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'long');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2024/);
      expect(result.length).toBeGreaterThan(10);
    });

    it('should handle string input', () => {
      const result = formatDate('2024-01-15', 'short');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/01|1/);
      expect(result).toMatch(/2024/);
    });

    it('should default to short format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/01|1/);
      expect(result).toMatch(/2024/);
    });
  });

  describe('formatDateTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:30:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format date and time', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/01|1/);
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/14/);
      expect(result).toMatch(/30/);
    });

    it('should handle string input', () => {
      const result = formatDateTime('2024-01-15T14:30:00');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/01|1/);
      expect(result).toMatch(/2024/);
    });
  });

  describe('truncate', () => {
    it('should truncate text longer than maxLength', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate text shorter than maxLength', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should not truncate text equal to maxLength', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });

    it('should handle zero maxLength', () => {
      expect(truncate('Hello', 0)).toBe('...');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should get initials from single name', () => {
      expect(getInitials('John')).toBe('JO');
    });

    it('should get initials from multiple names', () => {
      expect(getInitials('John Michael Doe')).toBe('JD');
    });

    it('should handle extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    it('should convert to uppercase', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('should handle single character name', () => {
      expect(getInitials('A')).toBe('A');
    });
  });

  describe('sleep', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should resolve after specified milliseconds', async () => {
      const promise = sleep(1000);
      jest.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    });

    it('should not resolve before specified time', async () => {
      const callback = jest.fn();
      sleep(1000).then(callback);
      jest.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(500);
      await Promise.resolve();
      expect(callback).toHaveBeenCalled();
    });

    it('should handle zero milliseconds', async () => {
      const promise = sleep(0);
      jest.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should call function with latest arguments', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc('first');
      debouncedFunc('second');
      debouncedFunc('third');

      jest.advanceTimersByTime(1000);

      expect(func).toHaveBeenCalledWith('third');
    });

    it('should reset timer on subsequent calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc();
      jest.advanceTimersByTime(500);
      debouncedFunc();
      jest.advanceTimersByTime(500);

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple debounce cycles', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc();
      jest.advanceTimersByTime(1000);
      expect(func).toHaveBeenCalledTimes(1);

      debouncedFunc();
      jest.advanceTimersByTime(1000);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should preserve function context and arguments', () => {
      const func = jest.fn((a: number, b: number) => a + b);
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc(5, 10);
      jest.advanceTimersByTime(1000);

      expect(func).toHaveBeenCalledWith(5, 10);
    });
  });
});
