import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OwnerProperty } from "./owner-property.entity";
import { User } from "./user.entity";

@Entity("construction_updates")
export class ConstructionUpdate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => OwnerProperty, { nullable: false, onDelete: "CASCADE" })
  property!: OwnerProperty;

  @Column({ type: "uuid" })
  propertyId!: string;

  @Column({ type: "integer", nullable: true })
  progress!: number | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  stage!: string | null;

  @Column({ type: "date", nullable: true })
  updateDate!: Date | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "simple-json", default: "[]" })
  photos!: string[];

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  createdBy!: User | null;

  @Column({ type: "uuid", nullable: true })
  createdById!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
