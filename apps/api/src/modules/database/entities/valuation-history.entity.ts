import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerProperty } from './owner-property.entity';

@Entity('valuation_history')
export class ValuationHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProperty, (property) => property.valuationHistory, { nullable: false, onDelete: 'CASCADE' })
  property!: OwnerProperty;

  @Column({ type: 'uuid' })
  propertyId!: string;

  @Column({ type: 'integer' })
  year!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  value!: number;

  @Column({ type: 'varchar', length: 50, default: 'market_estimate' })
  source!: string;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
