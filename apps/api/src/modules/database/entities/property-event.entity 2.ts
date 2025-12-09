import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { OwnerProperty } from "./owner-property.entity";

/**
 * Сущность PropertyEvent - событие/изменение по объекту
 *
 * Что здесь хранится:
 * - Тип изменения (прогресс стройки, изменение дохода, изменение стоимости и т.д.)
 * - Значения до и после изменения
 * - Дата события
 */
@Entity("property_events")
export class PropertyEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Связь с объектом
  @ManyToOne(() => OwnerProperty, (property) => property.events, {
    nullable: false,
    onDelete: "CASCADE",
  })
  property!: OwnerProperty;

  @Column({ type: "uuid" })
  propertyId!: string;

  // Тип изменения
  @Column({ type: "varchar", length: 50 })
  changeType!:
    | "construction_progress"
    | "construction_stage"
    | "completion_date"
    | "booking_added"
    | "expense_added"
    | "income_updated"
    | "valuation_updated"
    | "status_changed";

  // Значение до изменения (JSON)
  @Column({ type: "jsonb", nullable: true })
  beforeValue!: any;

  // Значение после изменения (JSON)
  @Column({ type: "jsonb", nullable: true })
  afterValue!: any;

  // Описание изменения (для отображения в ленте)
  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
