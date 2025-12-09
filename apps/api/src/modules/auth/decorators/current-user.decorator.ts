import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { User } from "../../database/entities/user.entity";

/**
 * Декоратор @CurrentUser() для получения текущего пользователя из request
 *
 * Использование:
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
