import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OwnerProperty } from "./owner-property.entity";

@Entity("property_metrics")
export class PropertyMetrics {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => OwnerProperty, (property) => property.metrics, {
    nullable: false,
    onDelete: "CASCADE",
  })
  property!: OwnerProperty;

  @Column({ type: "uuid" })
  propertyId!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  income!: number | null;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  expenses!: number | null;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  netIncome!: number | null;

  @Column({ type: "integer", nullable: true })
  occupancy!: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  adr!: number | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
