import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Put,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

/**
 * AuthController - API endpoints для аутентификации
 *
 * Endpoints:
 * - POST /api/auth/register - регистрация нового пользователя (только для админов)
 * - POST /api/auth/login - вход пользователя (получение JWT токена)
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/register
   * Регистрация нового пользователя
   *
   * Примечание: В будущем добавим проверку прав (только админы могут регистрировать)
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /api/auth/login
   * Вход пользователя
   *
   * Возвращает:
   * - accessToken: JWT токен для доступа к защищённым endpoints
   * - user: данные пользователя (без пароля)
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /api/auth/profile
   * Получение профиля текущего пользователя
   *
   * Требует аутентификации (JWT токен)
   * Возвращает данные пользователя (без пароля)
   */
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.authService.getProfile(user.id);
  }

  /**
   * PUT /api/auth/profile
   * Обновление профиля текущего пользователя
   *
   * Требует аутентификации (JWT токен)
   * Все поля опциональны - можно обновлять только нужные
   * Возвращает обновлённые данные пользователя (без пароля)
   */
  @Put("profile")
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }
}
