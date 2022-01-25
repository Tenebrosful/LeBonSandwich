import * as express from "express";
import { getBDD } from "../../database/database";
import { Commande } from "../../database/models/Commande";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
    try {
        const allCommande = await Commande.findAll();
        res.status(200).json(allCommande);
      } catch (error) {
        next(error);
      }
    });

export default commandes;