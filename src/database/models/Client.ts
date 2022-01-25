import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, IsEmail, Model, NotNull, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table
export class Client extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @CreatedAt
  @Default(null)
  created_at: Date;

  @UpdatedAt
  @Default(null)
  updated_at: Date;

  @Column(DataType.STRING(128))
  nom_client: string;

  @IsEmail
  @Column(DataType.STRING(256))
  mail_client: string;

  @Column({ type: DataType.STRING(256) })
  passwd: string;

  @Default(null)
  @Column(DataType.DECIMAL(8, 2))
  cumul_achats: number;

}