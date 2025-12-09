import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
} from "class-validator";

export class CreatePayoutDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsDateString()
  payoutDate!: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
