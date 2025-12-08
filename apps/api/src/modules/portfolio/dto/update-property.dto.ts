import { IsString, IsNumber, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsNumber()
  @IsOptional()
  currentEstimate?: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  constructionProgress?: number;

  @IsString()
  @IsOptional()
  constructionStage?: string;

  @IsDateString()
  @IsOptional()
  plannedCompletionDate?: string;

  @IsNumber()
  @IsOptional()
  expectedAdr?: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  expectedOccupancy?: number;
}
