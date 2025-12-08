import { IsDecimal, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateValuationDto {
  @IsDecimal()
  value!: number;

  @IsDateString()
  valuationDate!: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
