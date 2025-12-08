import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerProperty } from './owner-property.entity';
import { User } from './user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OwnerProperty, { nullable: false, onDelete: 'CASCADE' })
  property!: OwnerProperty;

  @Column({ type: 'uuid' })
  propertyId!: string;

  @Column({ type: 'varchar', length: 255 })
  fileName!: string;

  @Column({ type: 'varchar', length: 500 })
  fileUrl!: string;

  @Column({ type: 'varchar', length: 50 })
  documentType!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mimeType!: string | null;

  @Column({ type: 'integer', nullable: true })
  fileSize!: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  uploadedBy!: User | null;

  @Column({ type: 'uuid', nullable: true })
  uploadedById!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
