import { validate } from 'class-validator';

import { LoginDto } from '../../../auth/dto/login.dto';

describe('LoginDto', () => {
  it('should pass validation with valid email and password', async () => {
    const dto = new LoginDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new LoginDto();
    dto.email = 'invalid-email';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with empty email', async () => {
    const dto = new LoginDto();
    dto.email = '';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with empty password', async () => {
    const dto = new LoginDto();
    dto.email = 'test@example.com';
    dto.password = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail validation with missing email and password', async () => {
    const dto = new LoginDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
