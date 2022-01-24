import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class Client extends Model {
  @Column({type: DataType.STRING(128)})
  nom_client: string;
  @Column({type: DataType.STRING(256)})
  mail_client: string;
  @Column({type: DataType.STRING(256)})
  passwd: string;
  
  
  cumul_achats: number;
  
  
  created_at: Date;
  
  
  updated_at: Date;
}