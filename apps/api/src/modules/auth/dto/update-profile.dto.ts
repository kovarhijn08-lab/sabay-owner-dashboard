import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from "class-validator";

/**
 * DTO для обновления профиля менеджера
 *
 * Все поля опциональны - можно обновлять только нужные
 */
export class UpdateProfileDto {
  // Имя менеджера (отображается клиентам)
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Имя должно содержать минимум 2 символа" })
  @MaxLength(200, { message: "Имя не должно превышать 200 символов" })
  name?: string;

  // WhatsApp номер для CTA кнопок (формат: +79991234567 или 79991234567)
  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: "WhatsApp номер должен содержать минимум 10 символов",
  })
  @MaxLength(50, { message: "WhatsApp номер не должен превышать 50 символов" })
  whatsapp?: string;

  // Email для связи
  @IsOptional()
  @IsEmail({}, { message: "Некорректный формат email" })
  @MaxLength(200, { message: "Email не должен превышать 200 символов" })
  email?: string;

  // Дополнительная информация о менеджере (биография)
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: "Биография не должна превышать 2000 символов" })
  bio?: string;

  // URL фото менеджера
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "URL фото не должен превышать 500 символов" })
  photoUrl?: string;
}
