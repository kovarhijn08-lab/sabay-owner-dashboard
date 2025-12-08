import { IsUUID, IsOptional } from 'class-validator';

export class AssignManagerDto {
  @IsUUID()
  @IsOptional()
  managerId?: string | null;

  @IsUUID()
  @IsOptional()
  ownerId?: string | null;

  @IsUUID()
  @IsOptional()
  managementCompanyId?: string | null;
}
