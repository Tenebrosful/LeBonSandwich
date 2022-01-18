import { Column, Model, Table } from "sequelize-typescript";
import { DataTypes } from "sequelize/dist";

@Table
class Client extends Model {
  @Column({type: DataTypes.STRING(128)})
  nom_client: string;
  @Column({type: DataTypes.STRING(256)})
  mail_client: string;
  
  
  passwd: string;
  
  
  cumul_achats: number;
  
  
  created_at: Date;
  
  
  updated_at: Date;
}