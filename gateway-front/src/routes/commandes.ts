import axios from "axios";
import * as express from "express";
import error405 from "../errors/error405";
import testAuthMiddleware from "../middleware/testAuthMiddleware"
const commandes = express.Router();

commandes.get("/", testAuthMiddleware, async (req, res, next) => {

    /*if(!testAuthManagerMiddleware(req, res, next)){
      res.status(403).json({
        code: 403,
        message: `Your not allowed to access on this page`
      });
    }*/

  try {
    axios.get(`${process.env.AUTHENTIFICATION}/`)
      .then(function (response) {
        res.status(201).send(response.data);
      })
      .catch(function (error) {
        next(error);
      });

  } catch (error) {
    next(error);
  }
  
});

commandes.use("/", error405);

export default commandes;