import { IsInt, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class UpdateConstructionUpdateDto {
  @IsInt()
  @IsOptional()
  progress?: number;

  @IsString()
  @IsOptional()
  stage?: string;

  @IsDateString()
  @IsOptional()
  updateDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  photos?: string[];
}
