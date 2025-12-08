import { IsString, IsDecimal, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name!: string;

  @IsString()
  region!: string;

  @IsDecimal()
  purchasePrice!: number;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

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
