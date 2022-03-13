import { Column, CreatedAt, DataType, Default, HasMany, IsEmail, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Commande } from "./Commande";

@Table({tableName: "user"})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Default(null)
  @CreatedAt
  @Column
  created_at: Date;

  @Default(null)
  @UpdatedAt
  @Column
  updated_at: Date;

  @Column(DataType.STRING(128))
  nom: string;

  @IsEmail
  @Column(DataType.STRING(256))
  mail: string;

  @Column({ type: DataType.STRING(256) })
  passwd: string;

  @Default(null)
  @Column(DataType.DECIMAL(8, 2))
  cumul_achats: number;

  @Default(null)
  @Column(DataType.STRING(128))
  token : string;

  @Default(0)
  @Column(DataType.INTEGER)
  status: number;

  @HasMany(() => Commande, "user_id")
  commandes: Commande[];

}