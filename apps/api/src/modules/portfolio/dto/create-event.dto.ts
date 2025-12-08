import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

/**
 * DTO для создания события по объекту
 */
export class CreateEventDto {
  @IsEnum([
    'construction_progress',
    'construction_stage',
    'completion_date',
    'booking_added',
    'expense_added',
    'income_updated',
    'valuation_updated',
    'status_changed',
  ])
  changeType!:
    | 'construction_progress'
    | 'construction_stage'
    | 'completion_date'
    | 'booking_added'
    | 'expense_added'
    | 'income_updated'
    | 'valuation_updated'
    | 'status_changed';

  @IsOptional()
  @IsObject()
  beforeValue?: any;

  @IsOptional()
  @IsObject()
  afterValue?: any;

  @IsOptional()
  @IsString()
  description?: string;
}

