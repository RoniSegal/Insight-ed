import { validate } from 'class-validator';

import { RefreshTokenDto } from '../../../auth/dto/refresh-token.dto';

describe('RefreshTokenDto', () => {
  it('should pass validation with valid refresh token', async () => {
    const dto = new RefreshTokenDto();
    dto.refreshToken = 'valid-refresh-token-123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty refresh token', async () => {
    const dto = new RefreshTokenDto();
    dto.refreshToken = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing refresh token', async () => {
    const dto = new RefreshTokenDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const error = errors.find((e) => e.property === 'refreshToken');
    expect(error).toBeDefined();
  });

  it('should fail validation with non-string refresh token', async () => {
    const dto = new RefreshTokenDto();
    (dto as any).refreshToken = 12345;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const error = errors.find((e) => e.property === 'refreshToken');
    expect(error).toBeDefined();
  });
});
