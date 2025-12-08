import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type DictionaryType = 'booking_source' | 'expense_type' | 'document_type';

@Entity('dictionaries')
@Index(['type', 'key'], { unique: true })
export class Dictionary {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: DictionaryType;

  @Column({ type: 'varchar', length: 100 })
  key!: string;

  @Column({ type: 'varchar', length: 255 })
  label!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: 'integer', nullable: true })
  sortOrder!: number | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
