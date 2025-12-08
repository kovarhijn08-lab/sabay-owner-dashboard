import { IsDateString, IsDecimal, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @IsDecimal()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  guestName?: string;
}
