import * as express from "express";
import { getBDD } from "../../database/database";
import { Client } from "../../database/models/Client";
const clients = express.Router();

clients.get("/", async (req, res, next) => {
    try {
        const allClient = await Client.findAll();
        res.status(200).json(allClient);
      } catch (error) {
        next(error);
      }
    });
  
clients.use("/", (req, res) => {
  res.status(405);
})

export default clients;