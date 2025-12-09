import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Project } from "./project.entity";
import { OwnerProperty } from "./owner-property.entity";

/**
 * Сущность Unit - юнит (квартира/вилла) в проекте
 *
 * Что здесь хранится:
 * - Все данные юнита из распарсенного проекта (номер, корпус, этаж, площадь и т.п.)
 * - Связь с Project
 * - Связь с OwnerProperty (один юнит может иметь несколько владельцев во времени)
 */
@Entity("units")
export class Unit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Связь с проектом (может быть null для standalone объектов)
  @ManyToOne(() => Project, { nullable: true, onDelete: "SET NULL" })
  project!: Project | null;

  @Column({ type: "uuid", nullable: true })
  projectId!: string | null;

  // === Данные юнита ===

  // Номер юнита (например, "A-101", "Villa 5")
  @Column({ type: "varchar", length: 100 })
  unitNumber!: string;

  // Корпус/здание (если применимо)
  @Column({ type: "varchar", length: 100, nullable: true })
  building!: string | null;

  // Этаж
  @Column({ type: "integer", nullable: true })
  floor!: number | null;

  // Площадь (в м²)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  area!: number | null;

  // Количество комнат
  @Column({ type: "integer", nullable: true })
  rooms!: number | null;

  // Дополнительные характеристики (JSON)
  @Column({ type: "simple-json", nullable: true })
  specs!: Record<string, any> | null;

  // === Менеджер ===

  // ID менеджера, ответственного за этот юнит
  @Column({ type: "uuid", nullable: true })
  managerId!: string | null;

  // === Soft-delete ===

  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;

  // === Служебные поля ===

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // === Связи ===

  // Один юнит может иметь несколько OwnerProperty во времени
  @OneToMany(() => OwnerProperty, (property) => property.unit)
  ownerProperties!: OwnerProperty[];
}
