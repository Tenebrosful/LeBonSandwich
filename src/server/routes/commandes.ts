import * as express from "express";
import { Commande } from "../../database/models/Commande";
import error405 from "../errors/error405";
import { error422DatabaseUpsert } from "../errors/error422";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
  try {
    const allCommande = await Commande.findAll(
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
      count: allCommande.length,
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

commandes.put("/:id", async (req, res, next) => {
  const commandFields = {
    livraison: req.body.livraison,
    mail: req.body.mail,
    nom: req.body.nom
  };

  try {
    const newOrUpdatedCommande = await Commande.upsert({ id: req.params.id, ...commandFields });
    console.log(newOrUpdatedCommande);

    if (newOrUpdatedCommande[1])
      res.status(201).json(newOrUpdatedCommande[0].toJSON());
    else
      res.status(204).send();
  } catch (error) {
    error422DatabaseUpsert(error, req, res);
    next(error);
  }
});

commandes.use("/", error405);

export default commandes;