import * as express from "express";

import logger from "./middleware/logger";
import * as bodyParser from "body-parser";

import commandes from "./routes/commandes";
import auth from './routes/auth';

import error400 from "./errors/error400";
import error500 from "./errors/error500";

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(logger);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/commande", commandes);

app.use("/api/auth", auth);

/**
 * Handle Errors
 */

app.use(error400);
app.use(error500); // Must be on last position

app.listen(port, () => {
    console.log(`Server started at port http://localhost:${port}`);
});