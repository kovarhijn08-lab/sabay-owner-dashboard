import { IsString, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  fileName!: string;

  @IsString()
  fileUrl!: string;

  @IsString()
  documentType!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
