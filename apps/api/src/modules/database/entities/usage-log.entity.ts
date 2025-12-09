import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("usage_logs")
export class UsageLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 50 })
  feature!: string;

  @Column({ type: "varchar", length: 50 })
  action!: string;

  @Column({ type: "simple-json", nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
