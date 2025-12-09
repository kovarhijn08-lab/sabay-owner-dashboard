import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Subscription } from "./subscription.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => Subscription, { nullable: true, onDelete: "SET NULL" })
  subscription!: Subscription | null;

  @Column({ type: "uuid", nullable: true })
  subscriptionId!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", length: 10, default: "USD" })
  currency!: string;

  @Column({ type: "varchar", length: 50 })
  status!: "pending" | "completed" | "failed" | "refunded";

  @Column({ type: "varchar", length: 50, nullable: true })
  paymentMethod!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  transactionId!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
