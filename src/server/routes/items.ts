import * as express from "express";
import { getBDD } from "../../database/database";
import { Item } from "../../database/models/Item";
const items = express.Router();

items.get("/", async (req, res, next) => {
    try {
        const allItem = await Item.findAll();
        res.status(200).json(allItem);
      } catch (error) {
        next(error);
      }
    });

export default items;