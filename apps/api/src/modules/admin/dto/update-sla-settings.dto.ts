import { IsEnum, IsOptional, IsNumber, IsObject } from "class-validator";

export class UpdateSLASettingsDto {
  @IsEnum(["monthly_window", "days_threshold"])
  @IsOptional()
  mode?: "monthly_window" | "days_threshold";

  @IsNumber()
  @IsOptional()
  windowStartDay?: number | null;

  @IsNumber()
  @IsOptional()
  windowEndDay?: number | null;

  @IsNumber()
  @IsOptional()
  thresholdDays?: number | null;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}
