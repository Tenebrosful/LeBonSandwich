import { AutoIncrement, Column, CreatedAt, DataType, Default, HasMany, IsEmail, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Commande } from "./Commande";

@Table({tableName: "client"})
export class Client extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(null)
  @CreatedAt
  @Column
  created_at: Date;

  @Default(null)
  @UpdatedAt
  @Column
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

  @HasMany(() => Commande, "client_id")
  commandes: Commande[];

}