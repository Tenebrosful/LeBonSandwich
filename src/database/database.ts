import * as dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { Client } from "./models/Client";
import { Commande } from "./models/Commande";

/**
 * Setup
 */

dotenv.config({ path: "config/bdd.env" });

let BDDInstance: Sequelize;

export async function initBDD() {
  console.log(process.env.MYSQL_DATABASE, process.env.BDD_DRIVER, process.env.MYSQL_HOST, process.env.MYSQL_PASSWORD, process.env.MYSQL_USER);

const instance = new Sequelize({
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.BDD_DRIVER as Dialect,
  host: process.env.MYSQL_HOST,
  models: [Client, Commande],
  password: process.env.MYSQL_PASSWORD,
  port: 3306,
  username: process.env.MYSQL_USER,
});


  try {
    await instance.authenticate();
    console.log('Connection has been established successfully.');
    BDDInstance = instance;
    return instance;
  }
  catch (error) {
    console.error("Unable to connect to the database", error);
    return null;
  }
}

export function getBDD() {
  return BDDInstance ?? initBDD();
}

export function closeBDD() {
  BDDInstance.close();
}