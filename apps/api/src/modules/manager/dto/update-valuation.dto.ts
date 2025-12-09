import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  Min,
} from "class-validator";

export class UpdateValuationDto {
  @IsNumber()
  @Min(0.01)
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
