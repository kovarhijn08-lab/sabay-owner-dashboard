import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { OwnerProperty } from './owner-property.entity';

/**
 * Сущность ValuationHistory - история стоимости объекта
 *
 * Что здесь хранится:
 * - Год оценки
 * - Стоимость на этот год
 * - Источник оценки (покупка, рыночная оценка и т.д.)
 */
@Entity('valuation_history')
export class ValuationHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Связь с объектом
  @ManyToOne(() => OwnerProperty, (property) => property.valuationHistory, { nullable: false, onDelete: 'CASCADE' })
  property!: OwnerProperty;

  @Column({ type: 'uuid' })
  propertyId!: string;

  // Год оценки
  @Column({ type: 'integer' })
  year!: number;

  // Стоимость на этот год (в долларах)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  value!: number;

  // Источник оценки (например, 'purchase', 'market_estimate')
  @Column({ type: 'varchar', length: 50, default: 'market_estimate' })
  source!: string;

  // Примечание
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}

