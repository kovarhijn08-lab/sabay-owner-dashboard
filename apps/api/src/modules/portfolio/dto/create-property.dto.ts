import { IsString, IsNumber, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  name!: string;

  @IsString()
  region!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => {
    // Преобразуем строку в число, убирая пробелы и запятые
    if (typeof value === 'string') {
      const cleaned = value.replace(/\s/g, '').replace(/,/g, '.');
      return parseFloat(cleaned);
    }
    return typeof value === 'number' ? value : parseFloat(value);
  })
  purchasePrice!: number;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  // Номер квартиры/юнита (обязательное поле)
  @IsString()
  unitNumber!: string;

  // Опциональные поля для связей
  @IsUUID()
  @IsOptional()
  unitId?: string | null;

  @IsUUID()
  @IsOptional()
  projectId?: string | null;

  @IsUUID()
  @IsOptional()
  managerId?: string | null;

  @IsUUID()
  @IsOptional()
  managementCompanyId?: string | null;
}
