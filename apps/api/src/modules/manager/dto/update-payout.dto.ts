import { IsDecimal, IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdatePayoutDto {
  @IsDecimal()
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
}
