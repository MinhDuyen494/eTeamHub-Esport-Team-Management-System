import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('RolesGuard - requiredRoles:', requiredRoles);
    const { user } = context.switchToHttp().getRequest();
    console.log('RolesGuard - user:', user);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Không set role thì cho qua
    }
    if (!user || !requiredRoles.includes(user.role)) {
    throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    return true;
  }
}
