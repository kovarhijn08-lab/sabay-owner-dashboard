import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNumber,
} from "class-validator";

export class UpdateDictionaryDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
