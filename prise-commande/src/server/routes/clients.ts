import * as express from "express";
import { Client } from "../../../../database/models/Client";
import error405 from "../errors/error405";
const clients = express.Router();

clients.get("/", async (req, res, next) => {
    try {
        const allClient = await Client.findAll();
        res.status(200).json(allClient);
      } catch (error) {
        next(error);
      }
    });
  
clients.use("/", error405);

export default clients;