import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    const mockReflector = {} as Reflector; // Provide a mock Reflector
    expect(new RoleGuard(mockReflector)).toBeDefined();
  });
});
