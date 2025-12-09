import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { OwnerProperty } from "./owner-property.entity";

/**
 * Сущность PortfolioGoal - цель портфеля инвестора
 *
 * Что здесь хранится:
 * - Тип цели (ROI, доход, количество объектов и т.д.)
 * - Целевое значение
 * - Текущее значение (вычисляется)
 * - Период и дата достижения
 * - Связь с владельцем и опционально с объектом
 */
@Entity("portfolio_goals")
export class PortfolioGoal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Связь с владельцем (инвестором)
  @ManyToOne(() => User, { nullable: false })
  owner!: User;

  @Column({ type: "uuid" })
  ownerId!: string;

  // Опциональная связь с конкретным объектом
  @ManyToOne(() => OwnerProperty, { nullable: true, onDelete: "SET NULL" })
  property!: OwnerProperty | null;

  @Column({ type: "uuid", nullable: true })
  propertyId!: string | null;

  // Тип цели
  @Column({ type: "varchar", length: 50 })
  goalType!:
    | "roi"
    | "yearly_income"
    | "properties_count"
    | "portfolio_value"
    | "value_growth";

  // Целевое значение
  @Column({ type: "decimal", precision: 15, scale: 2 })
  targetValue!: number;

  // Текущее значение (вычисляется, может быть null)
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  currentValue!: number | null;

  // Дата достижения цели (опционально)
  @Column({ type: "date", nullable: true })
  targetDate!: Date | null;

  // Период начала (опционально)
  @Column({ type: "date", nullable: true })
  periodFrom!: Date | null;

  // Период окончания (опционально)
  @Column({ type: "date", nullable: true })
  periodTo!: Date | null;

  // Описание цели
  @Column({ type: "text", nullable: true })
  description!: string | null;

  // Статус цели: 'active' или 'archived'
  @Column({ type: "varchar", length: 20, default: "active" })
  status!: "active" | "archived";

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
