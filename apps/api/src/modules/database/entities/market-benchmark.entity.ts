import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Сущность MarketBenchmark - рыночные показатели по районам
 *
 * Что здесь хранится:
 * - Средний ADR по району
 * - Средняя занятость по району
 * - Средняя доходность по району
 */
@Entity('market_benchmarks')
export class MarketBenchmark {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Район на Пхукете
  @Column({ type: 'varchar', length: 255, unique: true })
  region!: string;

  // Средний ADR (Average Daily Rate) в долларах
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  adrAvg!: number;

  // Средняя занятость (0-100)
  @Column({ type: 'integer' })
  occupancyAvg!: number;

  // Средняя доходность (%)
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  yieldAvg!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}

