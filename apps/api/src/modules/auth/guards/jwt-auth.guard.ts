import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * JwtAuthGuard - Guard для защиты роутов JWT токеном
 *
 * Использование:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * protectedRoute() { ... }
 *
 * После применения этого Guard, в request.user будет доступен объект User
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
