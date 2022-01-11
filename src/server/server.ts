import * as express from "express";
import * as dotenv from "dotenv";

dotenv.config({ path: "config/server.env" });
//dotenv.config({ path: "config/bdd.env" });

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

import logger from "./middleware/logger";
app.use(logger);

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