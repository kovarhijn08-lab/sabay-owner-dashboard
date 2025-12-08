import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * AuthService - сервис для аутентификации и регистрации пользователей
 *
 * Что делает:
 * - Регистрация новых пользователей (с хэшированием пароля)
 * - Вход пользователей (проверка логина и пароля)
 * - Генерация JWT токенов
 * - Валидация токенов
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Регистрация нового пользователя
   * @param registerDto - данные для регистрации (логин, пароль, роль)
   * @returns созданный пользователь (без пароля)
   */
  async register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    // Проверяем, не существует ли уже пользователь с таким логином
    const existingUser = await this.userRepository.findOne({
      where: { login: registerDto.login },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }

    // Хэшируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Создаём нового пользователя
    const user = this.userRepository.create({
      login: registerDto.login,
      passwordHash,
      role: registerDto.role || 'manager',
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Возвращаем пользователя без пароля
    const { passwordHash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * Вход пользователя
   * @param loginDto - данные для входа (логин, пароль)
   * @returns JWT токен и данные пользователя
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    // Находим пользователя по логину
    const user = await this.userRepository.findOne({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    // Проверяем, активен ли пользователь
    if (!user.isActive) {
      throw new UnauthorizedException('Пользователь деактивирован');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    // Генерируем JWT токен
    const payload = { sub: user.id, login: user.login, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Возвращаем токен и данные пользователя (без пароля)
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      accessToken,
      user: userWithoutPassword,
    };
  }

  /**
   * Валидация пользователя по ID (для JWT стратегии)
   * @param userId - ID пользователя из токена
   * @returns данные пользователя или null
   */
  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    return user || null;
  }

  /**
   * Получение профиля текущего пользователя
   * @param userId - ID пользователя из токена
   * @returns данные пользователя (без пароля)
   */
  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Обновление профиля пользователя
   * @param userId - ID пользователя из токена
   * @param updateData - данные для обновления профиля
   * @returns обновлённый пользователь (без пароля)
   */
  async updateProfile(
    userId: string,
    updateData: { name?: string; whatsapp?: string; email?: string; bio?: string; photoUrl?: string },
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Обновляем только переданные поля
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.whatsapp !== undefined) user.whatsapp = updateData.whatsapp;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.bio !== undefined) user.bio = updateData.bio;
    if (updateData.photoUrl !== undefined) user.photoUrl = updateData.photoUrl;

    const updatedUser = await this.userRepository.save(user);

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

