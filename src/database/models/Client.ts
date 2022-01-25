import { Column, CreatedAt, DataType, IsEmail, Model, NotNull, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table
export class Client extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @NotNull
  @Column({ type: DataType.STRING(128) })
  nom_client: string;

  @NotNull
  @IsEmail
  @Column({ type: DataType.STRING(256) })
  mail_client: string;

  @Column({ type: DataType.STRING(256) })
  passwd: string;

  @Column({ type: DataType.DECIMAL(8, 2) })
  cumul_achats: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}