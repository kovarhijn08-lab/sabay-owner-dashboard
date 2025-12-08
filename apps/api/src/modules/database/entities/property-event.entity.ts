import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerProperty } from './owner-property.entity';
import { User } from './user.entity';

@Entity('property_events')
export class PropertyEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProperty, (property) => property.events, { nullable: false, onDelete: 'CASCADE' })
  property!: OwnerProperty;

  @Column({ type: 'uuid' })
  propertyId!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy!: User | null;

  @Column({ type: 'uuid', nullable: true })
  createdById!: string | null;

  @Column({ type: 'varchar', length: 50 })
  changeType!:
    | 'construction_update_added'
    | 'construction_progress_decreased'
    | 'booking_added'
    | 'booking_updated'
    | 'booking_deleted'
    | 'expense_added'
    | 'expense_updated'
    | 'expense_deleted'
    | 'payout_created'
    | 'payout_updated'
    | 'payout_deleted'
    | 'valuation_added'
    | 'valuation_updated'
    | 'valuation_deleted'
    | 'document_uploaded'
    | 'document_deleted'
    | 'status_changed'
    | 'manager_assigned'
    | 'manager_changed'
    | 'management_company_assigned'
    | 'owner_changed'
    | 'sla_violation_detected'
    | 'sla_violation_resolved'
    | 'property_created'
    | 'property_updated'
    | 'property_deleted';

  @Column({ type: 'simple-json', nullable: true })
  beforeValue!: any;

  @Column({ type: 'simple-json', nullable: true })
  afterValue!: any;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
