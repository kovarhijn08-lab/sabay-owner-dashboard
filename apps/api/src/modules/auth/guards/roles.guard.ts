import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../database/entities/user.entity';

/**
 * RolesGuard - Guard для проверки ролей пользователя
 *
 * Использование:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin')
 * @Get('admin-only-route')
 * adminOnlyRoute() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем требуемые роли из декоратора @Roles()
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Если роли не указаны, разрешаем доступ
    if (!requiredRoles) {
      return true;
    }

    // Получаем пользователя из request (добавлен JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован');
    }

    // Проверяем, есть ли у пользователя нужная роль
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Недостаточно прав доступа');
    }

    return true;
  }
}


