import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerProperty } from './owner-property.entity';
import { User } from './user.entity';

@Entity('payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProperty, { nullable: false, onDelete: 'CASCADE' })
  property!: OwnerProperty;

  @Column({ type: 'uuid' })
  propertyId!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  payoutDate!: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy!: User | null;

  @Column({ type: 'uuid', nullable: true })
  createdById!: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
