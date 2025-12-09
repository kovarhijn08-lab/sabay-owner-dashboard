import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "../database/entities/user.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

/**
 * AuthModule - модуль для аутентификации пользователей
 *
 * Что делает:
 * - Регистрация и вход пользователей (админов и менеджеров)
 * - Генерация JWT токенов для доступа к API
 * - Проверка прав доступа (Guards)
 * - Хэширование паролей (bcrypt)
 *
 * Используется:
 * - JWT для токенов доступа
 * - Passport для стратегий аутентификации
 * - bcrypt для хэширования паролей
 */
@Module({
  imports: [
    // Подключаем Passport для аутентификации
    PassportModule.register({ defaultStrategy: "jwt" }),
    // Подключаем JWT модуль с настройками из переменных окружения
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>("JWT_SECRET") ||
          "your-secret-key-change-in-production",
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN") || "7d", // Токен действует 7 дней
        },
      }),
    }),
    // Подключаем репозиторий User
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule], // Экспортируем для использования в других модулях
})
export class AuthModule {}
