import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { PropertyEvent } from './property-event.entity';
import { PropertyMetrics } from './property-metrics.entity';
import { ValuationHistory } from './valuation-history.entity';
import { Unit } from './unit.entity';
import { ManagementCompany } from './management-company.entity';

@Entity('owner_properties')
export class OwnerProperty {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.ownedProperties, { nullable: false })
  owner!: User;

  @Column({ type: 'uuid' })
  ownerId!: string;

  @ManyToOne(() => Unit, (unit) => unit.ownerProperties, { nullable: true, onDelete: 'SET NULL' })
  unit!: Unit | null;

  @Column({ type: 'uuid', nullable: true })
  unitId!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  manager!: User | null;

  @Column({ type: 'uuid', nullable: true })
  managerId!: string | null;

  @ManyToOne(() => ManagementCompany, { nullable: true, onDelete: 'SET NULL' })
  managementCompany!: ManagementCompany | null;

  @Column({ type: 'uuid', nullable: true })
  managementCompanyId!: string | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  region!: string;

  @Column({ type: 'varchar', length: 50 })
  status!: 'under_construction' | 'rental' | 'closed';

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  purchasePrice!: number;

  @Column({ type: 'date', nullable: true })
  purchaseDate!: Date | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentEstimate!: number | null;

  @Column({ type: 'integer', nullable: true })
  constructionProgress!: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  constructionStage!: string | null;

  @Column({ type: 'date', nullable: true })
  plannedCompletionDate!: Date | null;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate!: Date | null;

  @Column({ type: 'simple-json', default: '[]' })
  constructionPhotos!: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  expectedAdr!: number | null;

  @Column({ type: 'integer', nullable: true })
  expectedOccupancy!: number | null;

  @Column({ type: 'varchar', length: 20, default: 'medium' })
  riskLevel!: 'low' | 'medium' | 'high';

  @Column({ type: 'datetime', nullable: true })
  lastConstructionUpdateAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastRentalUpdateAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @OneToMany(() => PropertyEvent, (event) => event.property)
  events!: PropertyEvent[];

  @OneToMany(() => PropertyMetrics, (metrics) => metrics.property)
  metrics!: PropertyMetrics[];

  @OneToMany(() => ValuationHistory, (history) => history.property)
  valuationHistory!: ValuationHistory[];
}
