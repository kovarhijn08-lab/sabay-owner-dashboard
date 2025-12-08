import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

/**
 * DTO для добавления записи в историю стоимости
 */
export class AddValuationDto {
  @IsNumber()
  @Min(2000)
  year!: number;

  @IsNumber()
  @Min(0)
  value!: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

