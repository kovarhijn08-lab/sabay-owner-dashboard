import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  Min,
  Max,
} from "class-validator";

export class UpdateConstructionUpdateDto {
  @IsInt()
  @Min(0)
  @Max(100)
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
