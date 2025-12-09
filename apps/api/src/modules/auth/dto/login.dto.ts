import { IsString, MinLength } from "class-validator";

/**
 * DTO для входа пользователя
 */
export class LoginDto {
  @IsString()
  login!: string;

  @IsString()
  @MinLength(6, { message: "Пароль должен быть не менее 6 символов" })
  password!: string;
}
