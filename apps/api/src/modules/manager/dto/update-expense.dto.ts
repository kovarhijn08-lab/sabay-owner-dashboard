import { IsDecimal, IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateExpenseDto {
  @IsDecimal()
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
