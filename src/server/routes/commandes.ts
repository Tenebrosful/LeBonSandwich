import * as express from "express";
import { Commande } from "../../database/models/Commande";
import { Item } from "../../database/models/Item";
import error405 from "../errors/error405";
import { error422DatabaseUpsert } from "../errors/error422";
import items from "./items";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
  try {
    const {count, rows: allCommande} = await Commande.findAndCountAll(
      { attributes: ["id", "mail", "montant", "created_at"] });

    const resData = {
      commandes: allCommande.map(commande => {
        return {
          date_commande: commande.created_at,
          id: commande.id,
          mail_client: commande.mail,
          montant: commande.montant
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

    const resData = {
      commandes: {
        date_commande: commande.created_at,
        date_livraison: commande.livraison,
        id: commande.id,
        mail_client: commande.mail,
        montant: commande.montant,
        nom_client: commande.nom
      },
      type: "resource"
    };

    res.status(200).json(resData);
  } catch (error) {
    next(error);
  }
});

commandes.get("/:id/items", async (req, res, next) => {
  try {
    const commande = await Commande.findOne(
      {
        attributes: ["id", "items"],
        where: { command_id: req.params.id }
      });

    if (!commande) {
      res.status(404).json({
        code: 404,
        message: `No commande found with id ${req.params.id}`
      });
      return;
    }

    const resData = {
      commandes: commande.items.map(item => {
        return {
          id: item.id,
          libelle: item.libelle,
          quantite: item.quantite,
          tarif: item.tarif
        };
      }),
      count: commande.items.length,
      type: "collection",
    };

    res.status(200).json(resData);
  } catch (error) {
    next(error);
  }
});

commandes.put("/:id", async (req, res, next) => {
  const commandFields = {
    livraison: req.body.livraison,
    mail: req.body.mail,
    nom: req.body.nom
  };

  try {
    const newOrUpdatedCommande = await Commande.upsert({ id: req.params.id, ...commandFields });
    console.log(newOrUpdatedCommande);

    if (newOrUpdatedCommande[1]) {
      const resData = {
        commandes: {
          date_commande: newOrUpdatedCommande[0].created_at,
          date_livraison: newOrUpdatedCommande[0].livraison,
          id: newOrUpdatedCommande[0].id,
          mail_client: newOrUpdatedCommande[0].mail,
          montant: newOrUpdatedCommande[0].montant,
          nom_client: newOrUpdatedCommande[0].nom
        },
        type: "resource"
      };

      res.status(201).json(resData);
    }
    else
      res.status(204).send();
  } catch (error) {
    error422DatabaseUpsert(error, req, res);
    next(error);
  }
});

commandes.use("/", error405);

export default commandes;