import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OwnerProperty } from "./owner-property.entity";
import { PortfolioGoal } from "./portfolio-goal.entity";

/**
 * Сущность User - пользователи системы
 *
 * Роли:
 * - admin - администратор системы
 * - manager - менеджер (внутренний менеджер Sabay)
 * - owner - владелец/инвестор недвижимости (объединена с investor)
 * - management_company - управляющая компания
 */
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  login!: string;

  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  // Роль пользователя: 'admin', 'manager', 'owner' или 'management_company'
  @Column({ type: "varchar", length: 20, default: "manager" })
  role!: "admin" | "manager" | "owner" | "management_company";

  @Column({ type: "varchar", length: 255, nullable: true })
  name!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  telegramChatId!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  whatsapp!: string | null;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  photoUrl!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  // Связь с объектами недвижимости (для владельцев)
  @OneToMany(() => OwnerProperty, (property) => property.owner)
  ownedProperties!: OwnerProperty[];

  // Связь с целями портфеля
  @OneToMany(() => PortfolioGoal, (goal) => goal.owner)
  portfolioGoals!: PortfolioGoal[];
}
