import * as express from "express";
import * as dotenv from "dotenv";
import { initBDD } from "../database/database";

dotenv.config({ path: "config/server.env" });

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

initBDD();

import logger from "./middleware/logger";
app.use(logger);

import commandes from "./routes/commandes";
app.use("/api/commande", commandes);

import clients from "./routes/clients";
app.use("/api/client", clients);

import items from "./routes/items";
app.use("/api/items", items);

/**
 * Handle Errors
 */

import error400 from "./errors/error400";
import error500 from "./errors/error500";
app.use(error400);
app.use(error500); // Must be on last position

app.listen(port, () => {
    console.log(`Server started at port http://localhost:${port}`);
});