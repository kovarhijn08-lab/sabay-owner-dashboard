import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNumber,
} from "class-validator";

export class CreateDictionaryDto {
  @IsEnum(["booking_source", "expense_type", "document_type"])
  type!: "booking_source" | "expense_type" | "document_type";

  @IsString()
  key!: string;

  @IsString()
  label!: string;

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
