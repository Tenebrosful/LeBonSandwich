import * as express from "express";
import { Commande } from "../database/models/Commande";
import { Item } from "../database/models/Item";
import error405 from "../errors/error405";
import { error422DatabaseUpdate } from "../errors/error422";
import handleToken from "../middleware/handleToken";
import * as jwt from "jsonwebtoken";
import { ResponseAllCommandes, ResponseCollection, ResponseCommande, ResponseItem, ResponseType } from "../types/ResponseTypes";
import CommandeSchema from "../database/validateSchema/CommandeSchema";
import handleDataValidation from "../middleware/handleDataValidation";
import { RequestItem } from "../types/RequestTypes";
import CommandeItemSchema from "../database/validateSchema/CommandeItemSchema";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
  try {
    const { count, rows: allCommande } = await Commande.findAndCountAll(
      { attributes: ["id", "nom", "created_at", "livraison", "status"], order:[["created_at", "ASC"]] });

    const resData: ResponseAllCommandes = {
      commandes: allCommande.map(commande => {
        return {
          created_at: commande.created_at,
          id: commande.id,
          links:{
            items: {href: `/commands/${commande.id}/items` },
            self: {href: `/commands/${commande.id}/` }
          },
          livraison: commande.livraison,
          nom: commande.mail,
          status: commande.montant
        };
      }),
      count,
      type: "collection",
    };

    res.status(200).json(resData);
  } catch (error) {
    next(error);
  }
});


commandes.use("/", error405);

export default commandes;