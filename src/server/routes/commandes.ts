import * as express from "express";
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

commandes.put("/:id", async (req, res, next) => {
  try{
    const newOrUpdatedCommande = await Commande.update({ ...req.body }, { where: { id: req.params.id } });
    res.status(204).send();
  }catch(error){
    next(error);
  }
})

commandes.use("/", error405);

export default commandes;