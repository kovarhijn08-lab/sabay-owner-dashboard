import { IsDecimal, IsDateString, IsString, IsOptional } from 'class-validator';

export class UpdateValuationDto {
  @IsDecimal()
  @IsOptional()
  value?: number;

  @IsDateString()
  @IsOptional()
  valuationDate?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
