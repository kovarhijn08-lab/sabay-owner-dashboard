import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  Min,
} from "class-validator";

export class CreateValuationDto {
  @IsNumber()
  @Min(0.01)
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
