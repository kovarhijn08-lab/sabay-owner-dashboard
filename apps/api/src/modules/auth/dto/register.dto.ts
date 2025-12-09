import { IsString, IsEnum, IsOptional, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  login!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(["admin", "manager", "owner", "management_company"])
  @IsOptional()
  role?: "admin" | "manager" | "owner" | "management_company";
}
