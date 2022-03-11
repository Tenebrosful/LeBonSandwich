import * as express from "express";
import { Item } from "../database/models/Item";
import error405 from "../errors/error405";
const items = express.Router();

items.get("/", async (req, res, next) => {
  try {
    const allItem = await Item.findAll();
    res.status(200).json(allItem);
  } catch (error) {
    next(error);
  }
});

items.use("/", error405);

export default items;