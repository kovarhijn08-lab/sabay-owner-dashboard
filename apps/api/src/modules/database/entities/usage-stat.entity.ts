import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("usage_stats")
export class UsageStat {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "varchar", length: 50 })
  feature!: string;

  @Column({ type: "integer", default: 0 })
  count!: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
