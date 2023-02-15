import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';
import { Role } from './const';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: String[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (roles.includes(Role.ADMIN) && !roles.includes(Role.NON_ADMIN)) {
      return user.isAdmin;
    } else if (!roles.includes(Role.ADMIN) && roles.includes(Role.NON_ADMIN)) {
      return !user.isAdmin;
    } else return roles.includes(Role.ADMIN) || roles.includes(Role.NON_ADMIN);
  }
}
