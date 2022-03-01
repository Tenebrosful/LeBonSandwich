import * as express from "express";
import * as dotenv from "dotenv";
import { initBDD } from "../database/database";

import logger from "./middleware/logger";

import commandes from "./routes/commandes";
import clients from "./routes/clients";

import error400 from "./errors/error400";
import error500 from "./errors/error500";

dotenv.config({ path: "config/server.env" });

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

initBDD();

app.use(logger);

app.use("/api/commande", commandes);

app.use("/api/client", clients);

/**
 * Handle Errors
 */

app.use(error400);
app.use(error500); // Must be on last position

app.listen(port, () => {
    console.log(`Server started at port http://localhost:${port}`);
});