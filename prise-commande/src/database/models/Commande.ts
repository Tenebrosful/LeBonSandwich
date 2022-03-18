import { BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, HasMany, IsDate, IsEmail, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "./User";
import { Item } from "./Item";

@Table({tableName: "commande"})
export class Commande extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @CreatedAt
  @Column
  created_at: Date;

  @Default(null)
  @UpdatedAt
  @Column
  updated_at: Date;

  @IsDate
  @Column
  livraison: Date;

  @Column(DataType.STRING(128))
  nom: string;

  @IsEmail
  @Column(DataType.STRING(256))
  mail: string;

  @Default(0)
  @Column(DataType.DECIMAL(8, 2))
  montant: number;

  @Default(null)
  @Column(DataType.DECIMAL(8, 2))
  remise: number;

  @Default(null)
  @Column(DataType.STRING(128))
  token : string;

  @Default(null)
  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  client_id: string;

  @BelongsTo(() => User, "client_id")
  user: User;

  @Default(null)
  @Column(DataType.STRING(128))
  ref_paiement : string;

  @Default(null)
  @IsDate
  @Column
  date_paiement: Date;

  @Default(null)
  @Column(DataType.INTEGER)
  mode_paiement: number;

  @Default(1)
  @Column(DataType.INTEGER)
  status: number;

  @HasMany(() => Item, "command_id")
  items: Item[];

}