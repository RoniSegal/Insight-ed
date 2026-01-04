import { validate } from 'class-validator';

import { ResetPasswordDto } from '../../../auth/dto/reset-password.dto';

describe('ResetPasswordDto', () => {
  it('should pass validation with valid token and password', async () => {
    const dto = new ResetPasswordDto();
    dto.token = 'valid-reset-token';
    dto.newPassword = 'NewPass@123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with missing token', async () => {
    const dto = new ResetPasswordDto();
    dto.newPassword = 'NewPass@123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const tokenError = errors.find((e) => e.property === 'token');
    expect(tokenError).toBeDefined();
  });

  it('should fail validation with short password', async () => {
    const dto = new ResetPasswordDto();
    dto.token = 'valid-token';
    dto.newPassword = 'Test@1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'newPassword');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints).toHaveProperty('minLength');
  });

  it('should fail validation with password missing uppercase', async () => {
    const dto = new ResetPasswordDto();
    dto.token = 'valid-token';
    dto.newPassword = 'newpass@123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'newPassword');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints).toHaveProperty('matches');
  });

  it('should fail validation with password missing lowercase', async () => {
    const dto = new ResetPasswordDto();
    dto.token = 'valid-token';
    dto.newPassword = 'NEWPASS@123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'newPassword');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation with password missing number or special char', async () => {
    const dto = new ResetPasswordDto();
    dto.token = 'valid-token';
    dto.newPassword = 'NewPassword';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'newPassword');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation with non-string token', async () => {
    const dto = new ResetPasswordDto();
    (dto as any).token = 12345;
    dto.newPassword = 'NewPass@123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const tokenError = errors.find((e) => e.property === 'token');
    expect(tokenError).toBeDefined();
  });

  it('should fail validation with missing newPassword', async () => {
    const dto = new ResetPasswordDto();
    dto.token = 'valid-token';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'newPassword');
    expect(passwordError).toBeDefined();
  });
});
