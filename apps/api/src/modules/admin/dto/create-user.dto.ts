import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login!: string;

  @IsString()
  password!: string;

  @IsEnum(['admin', 'manager', 'owner', 'management_company'])
  role!: 'admin' | 'manager' | 'owner' | 'management_company';

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
