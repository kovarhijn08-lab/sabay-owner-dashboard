import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type SLAType = "construction_update" | "rental_update";
export type SLAMode = "monthly_window" | "days_threshold";

@Entity("sla_settings")
export class SLASettings {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  type!: SLAType;

  @Column({ type: "varchar", length: 50 })
  mode!: SLAMode;

  @Column({ type: "integer", nullable: true })
  windowStartDay!: number | null;

  @Column({ type: "integer", nullable: true })
  windowEndDay!: number | null;

  @Column({ type: "integer", nullable: true })
  thresholdDays!: number | null;

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
}
