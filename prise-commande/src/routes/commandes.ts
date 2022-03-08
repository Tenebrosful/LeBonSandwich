import * as express from "express";
import { Commande } from "../../../database/src/models/Commande";
import { Item } from "../../../database/src/models/Item";
import error405 from "../errors/error405";
import { error422DatabaseUpdate } from "../errors/error422";
import handleToken from "../middleware/handleToken";
import * as jwt from "jsonwebtoken";
import { ResponseAllCommandes, ResponseCollection, ResponseCommande, ResponseItem, ResponseType } from "../types/ResponseTypes";
import CommandeSchema from "../../../database/src/validateSchema/CommandeSchema";
import handleDataValidation from "../middleware/handleDataValidation";
import { RequestItem } from "../types/RequestTypes";
import CommandeItemSchema from "../../../database/src/validateSchema/CommandeItemSchema";
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

  if (!handleDataValidation(CommandeSchema, commandFields, req, res, true)) return;

  let montant = 0;

  if (req.body.items) {
    const oltItems = await commande.$get("items");

    oltItems.forEach(item => item.destroy());

    let items: RequestItem[] = [];

    if (Array.isArray(req.body.items))
      items = req.body.items.map((item: RequestItem) => {
        return {
          libelle: item.libelle,
          quantite: item.quantite,
          tarif: item.tarif,
          uri: item.uri
        };
      });
    else
      items[0] = {
        libelle: req.body.items.libelle,
        quantite: req.body.items.quantite,
        tarif: req.body.items.tarif,
        uri: req.body.items.uri
      };

    if (!items.every(item => handleDataValidation(CommandeItemSchema, item, req, res, true))) return;

    const promises = items.map((x, i) => {
      // @ts-ignore
      items[i].command_id = commande.id;
      return Item.create(items[i]);
    });

    await Promise.all(promises);

    montant = items.map(item => item.quantite * item.tarif).reduce((acc, current) => acc + current);
  }

  try {
    await commande.update({...commandFields, montant});
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

  if (!handleDataValidation(CommandeSchema, commandFields, req, res, true)) return;

  try {
    const commande = await Commande.create({ ...commandFields });
    const token = jwt.sign(
      { token: commande.id },
      "RANDOM_TOKEN_SECRET");
    commande.token = token;
    if (commande) {

      let montant = 0;

      if (req.body.items) {
        let items: RequestItem[] = [];

        if (Array.isArray(req.body.items))
          items = req.body.items.map((item: RequestItem) => {
            return {
              libelle: item.libelle,
              quantite: item.quantite,
              tarif: item.tarif,
              uri: item.uri
            };
          });
        else
          items[0] = {
            libelle: req.body.items.libelle,
            quantite: req.body.items.quantite,
            tarif: req.body.items.tarif,
            uri: req.body.items.uri
          };

        if (!items.every(item => handleDataValidation(CommandeItemSchema, item, req, res, true))) return;

        const promises = items.map((x, i) => {
          // @ts-ignore
          items[i].command_id = commande.id;
          return Item.create(items[i]);
        });

        await Promise.all(promises);

        montant = items.map(item => item.quantite * item.tarif).reduce((acc, current) => acc + current);

        await commande.update({ montant: montant, token: token });

        const resData = {
          commandes: {
            date_livraison: commande.livraison,
            id: commande.id,
            mail_client: commande.mail,
            montant: montant,
            nom_client: commande.nom,
            token: token,
          },
          type: "resource",
        };

        res.status(201).json(resData);
      }
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

  if (handleDataValidation(CommandeSchema, commandFields, req, res)) return;

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