import { UserRole } from '@growth-engine/shared';
import { validate } from 'class-validator';

import { RegisterDto } from '../../../auth/dto/register.dto';

describe('RegisterDto', () => {
  it('should pass validation with all valid required fields', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with all fields including optional ones', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.phone = '1234567890';
    dto.schoolCode = 'SCHOOL1';
    dto.role = UserRole.TEACHER;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = 'Test@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with short password', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints).toHaveProperty('minLength');
  });

  it('should fail validation with password missing uppercase', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'test@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints).toHaveProperty('matches');
  });

  it('should fail validation with password missing lowercase', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'TEST@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation with password missing number or special char', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'TestPassword';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation with short firstName', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1234';
    dto.firstName = 'J';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const firstNameError = errors.find((e) => e.property === 'firstName');
    expect(firstNameError).toBeDefined();
    expect(firstNameError?.constraints).toHaveProperty('minLength');
  });

  it('should fail validation with short lastName', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1234';
    dto.firstName = 'John';
    dto.lastName = 'D';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const lastNameError = errors.find((e) => e.property === 'lastName');
    expect(lastNameError).toBeDefined();
    expect(lastNameError?.constraints).toHaveProperty('minLength');
  });

  it('should fail validation with invalid role', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.role = 'INVALID_ROLE' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const roleError = errors.find((e) => e.property === 'role');
    expect(roleError).toBeDefined();
  });

  it('should pass validation with valid PRINCIPAL role', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Test@1234';
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.role = UserRole.PRINCIPAL;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
