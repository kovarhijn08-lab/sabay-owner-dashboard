import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
} from "class-validator";

export class CreateExpenseDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  expenseType!: string;

  @IsDateString()
  expenseDate!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
