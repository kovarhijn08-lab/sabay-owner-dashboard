import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OwnerProperty } from "./owner-property.entity";
import { User } from "./user.entity";

@Entity("expenses")
export class Expense {
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

  @Column({ type: "date" })
  expenseDate!: Date;

  @Column({ type: "varchar", length: 50 })
  expenseType!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
