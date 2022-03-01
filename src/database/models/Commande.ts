import { BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, HasMany, IsDate, IsEmail, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Client } from "./Client";
import { Item } from "./Item";

@Table({tableName: "commande"})
export class Commande extends Model {
  @PrimaryKey
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

  @Default(null)
  @Column(DataType.DECIMAL(8, 2))
  montant: number;

  @Default(null)
  @Column(DataType.DECIMAL(8, 2))
  remise: number;

  @Default(null)
  @Column(DataType.STRING(128))
  token : string;

  @Default(null)
  @ForeignKey(() => Client)
  @Column(DataType.INTEGER)
  client_id: number;

  @BelongsTo(() => Client)
  client: Client;

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

  @HasMany(() => Item)
  items: Item[];

}