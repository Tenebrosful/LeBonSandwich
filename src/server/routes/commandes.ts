import * as express from "express";
import { Commande } from "../../database/models/Commande";
import { Item } from "../../database/models/Item";
import error405 from "../errors/error405";
import { error422DatabaseUpdate } from "../errors/error422";
import handleToken from "../middleware/handleToken";
import * as jwt from 'jsonwebtoken';
import { ResponseAllCommandes, ResponseCollection, ResponseCommande, ResponseCommandeLinks, ResponseItem, ResponseType } from "../types/ResponseTypes";
import { isSet } from "util/types";
import CommandeSchema from "../../database/validateSchema/CommandeSchema";
const commandes = express.Router();

commandes.get("/", async (req, res, next) => {
  try {
    const { count, rows: allCommande } = await Commande.findAndCountAll(
      { attributes: ["id", "mail", "montant", "created_at"] });

    const resData: ResponseAllCommandes = {
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

    const resData: { commande: ResponseCommande } & ResponseType = {
      commande: {
        date_commande: commande.created_at,
        date_livraison: commande.livraison,
        id: commande.id,
        mail_client: commande.mail,
        montant: commande.montant,
        nom_client: commande.nom,
        links: {
          items: { href: "/commande/" + commande.id + "/items/" },
          self: { href: "/commande/" + commande.id }
        },
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

commandes.get("/:id/items", async (req, res, next) => {
  try {
    const commande = await Commande.findOne(
      {
        where: { id: req.params.id }
      });

    if (!commande) {
      res.status(404).json({
        code: 404,
        message: `No commande found with id ${req.params.id}`
      });
      return;
    }

    const items = await commande.$get("items");

    const resData: { items: ResponseItem[] } & ResponseCollection = {
      count: items.length,
      items: items.map(item => {
        return {
          id: item.id,
          libelle: item.libelle,
          quantite: item.quantite,
          tarif: item.tarif
        };
      }),
      type: "collection",
    };

    res.status(200).json(resData);
  } catch (error) {
    next(error);
  }
});

commandes.put("/:id", handleToken, async (req, res, next) => {
  const commande = await Commande.findOne(
    {
      where: { id: req.params.id }
    });

  if (!commande) {
    res.status(404).json({
      code: 404,
      message: `No commande found with id ${req.params.id}`
    });
    return;
  }

  if (commande.token !== res.locals.token) { error405(req, res); return; }

  const commandFields = {
    livraison: req.body.livraison,
    mail: req.body.mail,
    nom: req.body.nom
  };

  const { error: validationError } = CommandeSchema.validate(commandFields);

  if (validationError) {
    res.status(422).json({ code: 422, message: validationError.details.map(details => details.message).join(", ").replaceAll('\"', "'") });
    return;
  }

  try {
    await commande.update(commandFields);
    res.status(204).send();
  } catch (error) {
    error422DatabaseUpdate(error, req, res);
    next(error);
  }
});

commandes.post("/", async (req, res, next) => {

  const commandFields = {
    livraison: req.body.livraison,
    mail: req.body.mail,
    nom: req.body.nom,
  };

  const { error } = CommandeSchema.validate(commandFields, { presence: "required" });

  if (error) {
    res.status(422).json({ code: 422, message: error.details.map(details => details.message).join(", ").replaceAll('\"', "'") });
    return;
  }

  try {
    const commande = await Commande.create({ ...commandFields });
    const token = jwt.sign(
      { token: commande.id },
      'RANDOM_TOKEN_SECRET');
    commande.token = token;
    if (commande) {

      let montant = 0;

      if (req.body.items) {
        let items = req.body.items
        for (let i = 0; i < items.length; i++) {
          items[i].command_id = commande.id;
          await Item.create(items[i]);
          console.log(items[i]);

          montant += items[i].tarif * items[i].quantite;
        }
      }
      console.log(montant + " update");

      await commande.update({ token: token, montant: montant })

      const resData = {
        commandes: {
          nom_client: commande.nom,
          mail_client: commande.mail,
          date_livraison: commande.livraison,
          id: commande.id,
          token: token,
          montant: montant
        },
        type: "resource",
      };

      res.status(201).json(resData);
    }
  } catch (error) {
    next(error);
  }

});


commandes.patch("/:id", handleToken, async (req, res, next) => {
  const commande = await Commande.findOne(
    {
      where: { id: req.params.id }
    });

  if (!commande) {
    res.status(404).json({
      code: 404,
      message: `No commande found with id ${req.params.id}`
    });
    return;
  }

  if (commande.token !== res.locals.token) error405(req, res);

  const commandFields = {
    livraison: req.body.livraison,
    mail: req.body.mail,
    nom: req.body.nom
  };

  const { error: validationError } = CommandeSchema.validate(commandFields);

  if (validationError) {
    res.status(422).json({ code: 422, message: validationError.details.map(details => details.message).join(", ").replaceAll('\"', "'") });
    return;
  }

  try {
    commande.update({ ...commandFields });
    res.status(204).send();
  } catch (error) {
    error422DatabaseUpdate(error, req, res);
    next(error);
  }

});

commandes.use("/", error405);

export default commandes;