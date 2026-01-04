import { ExecutionContext } from '@nestjs/common';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';

describe('CurrentUser Decorator', () => {
  it('should extract user from request object', () => {
    const mockUser = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'TEACHER',
    };

    const mockRequest = {
      user: mockUser,
    };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    const decorator = CurrentUser();
    const result = decorator(undefined, mockContext);

    expect(result).toEqual(mockUser);
    expect(mockContext.switchToHttp).toHaveBeenCalled();
  });

  it('should return undefined if user is not present in request', () => {
    const mockRequest = {};

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;

    const decorator = CurrentUser();
    const result = decorator(undefined, mockContext);

    expect(result).toBeUndefined();
  });
});
