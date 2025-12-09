import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OwnerProperty } from "./owner-property.entity";
import { User } from "./user.entity";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => OwnerProperty, { nullable: false, onDelete: "CASCADE" })
  property!: OwnerProperty;

  @Column({ type: "uuid" })
  propertyId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  uploadedBy!: User;

  @Column({ type: "uuid" })
  uploadedById!: string;

  @Column({ type: "varchar", length: 50 })
  type!: string;

  @Column({ type: "varchar", length: 255 })
  fileName!: string;

  @Column({ type: "varchar", length: 500 })
  fileUrl!: string;

  @Column({ type: "integer", default: 1 })
  version!: number;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
