import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerProperty } from './owner-property.entity';
import { User } from './user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProperty, { nullable: false, onDelete: 'CASCADE' })
  property!: OwnerProperty;

  @Column({ type: 'uuid' })
  propertyId!: string;

  @Column({ type: 'date' })
  checkIn!: Date;

  @Column({ type: 'date' })
  checkOut!: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  guestName!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy!: User | null;

  @Column({ type: 'uuid', nullable: true })
  createdById!: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
