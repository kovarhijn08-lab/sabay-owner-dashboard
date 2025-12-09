import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateGoalDto {
  @IsEnum([
    "roi",
    "yearly_income",
    "properties_count",
    "portfolio_value",
    "value_growth",
  ])
  goalType!:
    | "roi"
    | "yearly_income"
    | "properties_count"
    | "portfolio_value"
    | "value_growth";

  @IsNumber()
  @Min(0)
  targetValue!: number;

  @IsUUID()
  @IsOptional()
  propertyId?: string | null;

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
}
