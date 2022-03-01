import * as express from "express";
import { DatabaseError } from "sequelize";
import { Commande } from "../../database/models/Commande";
import error405 from "../errors/error405";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
  try {
    const allCommande = await Commande.findAll();
    res.status(200).json(allCommande);
  } catch (error) {
    next(error);
  }
});

commandes.get("/:id", async (req, res, next) => {
  try {
    const commande = await Commande.findAll({where: {id: req.params.id}});
    res.status(200).json(commande);
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
    // @ts-ignore
    if (error instanceof DatabaseError && error.original.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(422).json({
        code: 422,
        // @ts-ignore
        message: `Command with id ${req.params.id} doesn't exist and required fields are missing in the request body${process.env.NODE_ENV === "dev" ? " [[[[ " + error.original.text + " ]]]]" : ""}`
      });
      return;
    }

    next(error);
  }
});

commandes.use("/", error405);

export default commandes;