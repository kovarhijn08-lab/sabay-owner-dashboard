import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from "class-validator";

/**
 * DTO для обновления метрик доходности
 */
export class UpdateMetricsDto {
  @IsString()
  period!: string; // Формат: 'YYYY-MM'

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyIncome?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearlyIncome?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  occupancy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  adr?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  payoutAmount?: number;

  @IsOptional()
  @IsDateString()
  payoutDate?: string;
}
