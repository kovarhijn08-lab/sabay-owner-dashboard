import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateGoalDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  targetValue?: number;

  @IsString()
  @IsOptional()
  targetDate?: string | null;

  @IsString()
  @IsOptional()
  periodFrom?: string | null;

  @IsString()
  @IsOptional()
  periodTo?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsEnum(["active", "archived"])
  @IsOptional()
  status?: "active" | "archived";
}
