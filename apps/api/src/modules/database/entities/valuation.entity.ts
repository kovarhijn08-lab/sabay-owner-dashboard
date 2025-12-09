import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OwnerProperty } from "./owner-property.entity";
import { User } from "./user.entity";

@Entity("valuations")
export class Valuation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => OwnerProperty, { nullable: false, onDelete: "CASCADE" })
  property!: OwnerProperty;

  @Column({ type: "uuid" })
  propertyId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  createdBy!: User;

  @Column({ type: "uuid" })
  createdById!: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  value!: number;

  @Column({ type: "date" })
  valuationDate!: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  source!: string | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
