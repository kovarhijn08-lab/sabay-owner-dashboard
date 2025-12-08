import { IsDateString, IsDecimal, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @IsDecimal()
  totalAmount!: number;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  guestName?: string;
}
