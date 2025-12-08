import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(['admin', 'manager', 'owner', 'management_company'])
  @IsOptional()
  role?: 'admin' | 'manager' | 'owner' | 'management_company';

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  telegramChatId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
