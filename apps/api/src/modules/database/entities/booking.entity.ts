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

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  createdBy!: User;

  @Column({ type: 'uuid' })
  createdById!: string;

  @Column({ type: 'date' })
  checkinDate!: Date;

  @Column({ type: 'date' })
  checkoutDate!: Date;

  @Column({ type: 'varchar', length: 50 })
  source!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  guestName!: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;
}
