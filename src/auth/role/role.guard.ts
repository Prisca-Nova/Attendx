import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} // Reflector injected here

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<UserRole[]>('roles', context.getHandler()) ||
      this.reflector.get<UserRole[]>('roles', context.getClass()); // Check controller level
    if (!requiredRoles) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().user;

    return requiredRoles.includes(user?.role);
  }
}
