import * as express from "express";
import { Commande } from "../database/models/Commande";
import error405 from "../errors/error405";
import { ResponseAllCommandes } from "../types/ResponseTypes";
import { Op, WhereOptions } from "sequelize";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
  const filter: WhereOptions<any> = {};
  const limit = Math.max(parseInt(req.query.size as string) || 10, 0);
  const offset = Math.max(((parseInt(req.query.page as string) - 1) || 0) * limit, 0);

  if (req.query.s) 
    if (Array.isArray(req.query.s))
      filter.status = {[Op.or]: (req.query.s as string[]).map(s => parseInt(s, 10) || -1)};
    else
      filter.status = parseInt(req.query.s as string) || -1;

  try {
    const { count, rows: allCommande } = await Commande.findAndCountAll(
      {
        attributes: ["id", "nom", "created_at", "livraison", "status"],
        limit,
        offset,
        order: [["created_at", "ASC"]],
        where: filter
      });

    const resData: ResponseAllCommandes = {
      commandes: allCommande.map(commande => {
        return {
          created_at: commande.created_at,
          id: commande.id,
          links: {
            items: { href: `/commands/${commande.id}/items` },
            self: { href: `/commands/${commande.id}/` }
          },
          livraison: commande.livraison,
          nom: commande.mail,
          status: commande.montant
        };
      }),
      count,
      size: limit,
      type: "collection",
    };

    res.status(200).json(resData);
  } catch (error) {
    next(error);
  }
});

commandes.use("/", error405);

export default commandes;