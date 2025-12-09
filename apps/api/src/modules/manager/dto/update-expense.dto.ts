import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
} from "class-validator";

export class UpdateExpenseDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  expenseType?: string;

  @IsDateString()
  @IsOptional()
  expenseDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
