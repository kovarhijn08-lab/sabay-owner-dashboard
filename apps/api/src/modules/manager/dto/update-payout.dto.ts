import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
} from "class-validator";

export class UpdatePayoutDto {
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  payoutDate?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: "planned" | "paid" | "delayed";
}
