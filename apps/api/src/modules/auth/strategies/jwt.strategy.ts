import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../auth.service";
import { User } from "../../database/entities/user.entity";

/**
 * JWT Strategy - стратегия для проверки JWT токенов
 *
 * Что делает:
 * - Извлекает JWT токен из заголовка Authorization
 * - Проверяет подпись токена
 * - Валидирует пользователя через AuthService
 * - Добавляет данные пользователя в request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      // Извлекаем токен из заголовка Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Секретный ключ для проверки подписи токена
      secretOrKey:
        configService.get<string>("JWT_SECRET") ||
        "your-secret-key-change-in-production",
      ignoreExpiration: false, // Проверяем срок действия токена
    });
  }

  /**
   * Валидация токена и получение данных пользователя
   * @param payload - данные из JWT токена (sub, login, role)
   * @returns данные пользователя (будут доступны в request.user)
   */
  async validate(payload: {
    sub: string;
    login: string;
    role: string;
  }): Promise<User> {
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        "Пользователь не найден или деактивирован",
      );
    }

    return user;
  }
}
