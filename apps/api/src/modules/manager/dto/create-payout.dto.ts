import { IsDecimal, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreatePayoutDto {
  @IsDecimal()
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
