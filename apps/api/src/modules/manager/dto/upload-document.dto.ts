import { IsString, IsOptional } from "class-validator";

export class UploadDocumentDto {
  @IsString()
  documentType!: string;

  @IsString()
  fileName!: string;

  @IsString()
  fileUrl!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
