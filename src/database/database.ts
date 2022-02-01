import * as dotenv from "dotenv";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Client } from "./models/Client";
import { Commande } from "./models/Commande";

/**
 * Setup
 */

dotenv.config({ path: "config/bdd.env" });

let BDDInstance: Sequelize;

export function initBDD() {
  console.log(process.env.MYSQL_DATABASE, process.env.BDD_DRIVER, process.env.MYSQL_HOST, process.env.MYSQL_PASSWORD, process.env.MYSQL_USER);

  // const instance = new Sequelize({
  //   database: process.env.MYSQL_DATABASE,
  //   dialect: process.env.BDD_DRIVER as Dialect,
  //   host: process.env.MYSQL_HOST,
  //   models: [Client, Commande],
  //   password: process.env.MYSQL_PASSWORD,
  //   port: 3306,
  //   username: process.env.MYSQL_USER,
  // });

  /*
MYSQL_HOST=LeBonSandwich_db
MYSQL_ROOT_PASSWORD=a_password
MYSQL_DATABASE=iut_db
MYSQL_USER=iut_db
MYSQL_PASSWORD=b_password
MYSQL_PORT=3306

BDD_DRIVER=mariadb
  */

  const instance = new Sequelize({
    database: "iut_db",
    dialect: "mariadb",
    host: "LeBonSandwich_db",
    models: [Client, Commande],
    password: "b_password",
    port: 3306,
    username: "iut_db",
  });

  try {
    instance.authenticate();
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