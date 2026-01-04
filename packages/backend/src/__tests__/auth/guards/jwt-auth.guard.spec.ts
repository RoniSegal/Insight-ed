import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for public routes', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
    });

    it('should call super.canActivate for protected routes', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer token' },
          }),
        }),
      } as unknown as ExecutionContext;

      const getAllAndOverrideSpy = jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(false);

      // Mock the parent canActivate
      const superCanActivateSpy = jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockContext);

      superCanActivateSpy.mockRestore();
    });

    it('should handle when isPublic is undefined', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer token' },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const superCanActivateSpy = jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockContext);

      superCanActivateSpy.mockRestore();
    });
  });
});
