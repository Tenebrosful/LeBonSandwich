import { AutoIncrement, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Commande } from "./Commande";

@Table({tableName: "item", timestamps: false})
export class Item extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING(128))
  uri: string;

  @Default(null)
  @Column(DataType.STRING(128))
  libelle : string;

  @Default(null)
  @Column(DataType.DECIMAL(8, 2))
  tarif: number;

  @Default(1)
  @Column(DataType.INTEGER)
  quantite: number;

  @Default(null)
  @ForeignKey(() => Commande)
  @Column(DataType.STRING(128))
  command_id: string;

  @BelongsTo(() => Commande, "command_id")
  commande: Commande;

}