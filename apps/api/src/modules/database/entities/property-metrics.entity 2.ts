import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { OwnerProperty } from "./owner-property.entity";

/**
 * Сущность PropertyMetrics - метрики доходности объекта за период
 *
 * Что здесь хранится:
 * - Доход за месяц и год
 * - Занятость
 * - ADR (Average Daily Rate)
 * - Выплаты клиенту
 */
@Entity("property_metrics")
export class PropertyMetrics {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Связь с объектом
  @ManyToOne(() => OwnerProperty, (property) => property.metrics, {
    nullable: false,
    onDelete: "CASCADE",
  })
  property!: OwnerProperty;

  @Column({ type: "uuid" })
  propertyId!: string;

  // Период (год-месяц, например '2025-01')
  @Column({ type: "varchar", length: 7 })
  period!: string;

  // Доход за месяц (в долларах)
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  monthlyIncome!: number;

  // Доход за год (в долларах, накопительный)
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  yearlyIncome!: number;

  // Занятость (0-100)
  @Column({ type: "integer", default: 0 })
  occupancy!: number;

  // ADR (Average Daily Rate) в долларах
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  adr!: number | null;

  // Выплачено клиенту за период (в долларах)
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  payoutAmount!: number;

  // Дата выплаты
  @Column({ type: "date", nullable: true })
  payoutDate!: Date | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
