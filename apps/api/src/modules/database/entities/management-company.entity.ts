import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Сущность ManagementCompany - управляющая компания
 *
 * Что здесь хранится:
 * - Информация об управляющей компании
 * - Связь с объектами через OwnerProperty.managementCompanyId
 *
 * Использование:
 * - Для объектов, которые фактически управляются внешней/внутренней УК
 * - Отдельный кабинет для УК будет реализован позже
 */
@Entity("management_companies")
export class ManagementCompany {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Название управляющей компании
  @Column({ type: "varchar", length: 255 })
  name!: string;

  // Контактная информация
  @Column({
    type: "varchar",
    length: 200,
    nullable: true,
    name: "contactEmail",
  })
  email!: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, name: "contactPhone" })
  phone!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  website!: string | null;

  // Описание/дополнительная информация
  @Column({ type: "text", nullable: true })
  description!: string | null;

  // Активна ли компания
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

  // Soft delete
  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
