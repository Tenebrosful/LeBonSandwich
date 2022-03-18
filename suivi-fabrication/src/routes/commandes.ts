import * as express from "express";
import { Commande } from "../database/models/Commande";
import { ResponseAllCommandes, ResponseCommande, ResponseType } from "../types/ResponseTypes";
import error405 from "../errors/error405";
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

commandes.get("/:id", async (req, res, next) => {
  try {
    const commande = await Commande.findOne(
      {
        attributes: ["id", "mail", "nom", "created_at", "livraison", "montant"],
        where: { id: req.params.id }
      });

    if (!commande) {
      res.status(404).json({
        code: 404,
        message: `No commande found with id ${req.params.id}`
      });
      return;
    }

    const resData: { commande: ResponseCommande } & ResponseType = {
      commande: {
        date_commande: commande.created_at,
        date_livraison: commande.livraison,
        id: commande.id,
        links: {
          items: { href: "/commande/" + commande.id + "/items/" },
          self: { href: "/commande/" + commande.id }
        },
        mail_client: commande.mail,
        montant: commande.montant,
        nom_client: commande.nom,
      },

      type: "resource",
    };

    if (req.query.embed) {
      const embeds = (req.query.embed as string).split(",");

      if (embeds.includes("items")) resData.commande.items = (await commande.$get("items")).map(item => {
        return {
          id: item.id,
          libelle: item.libelle,
          quantite: item.quantite,
          tarif: item.tarif
        };
      });
    }

    res.status(200).json(resData);
  } catch (error) {
    next(error);
  }
});

commandes.use("/", error405);

export default commandes;