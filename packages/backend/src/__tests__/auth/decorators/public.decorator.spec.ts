import { SetMetadata } from '@nestjs/common';

import { IS_PUBLIC_KEY, Public } from '../../../auth/decorators/public.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn((key, value) => ({ key, value })),
}));

describe('Public Decorator', () => {
  it('should set metadata with IS_PUBLIC_KEY and true value', () => {
    const result = Public();

    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
    expect(result).toEqual({ key: IS_PUBLIC_KEY, value: true });
  });

  it('should have correct IS_PUBLIC_KEY value', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });
});
