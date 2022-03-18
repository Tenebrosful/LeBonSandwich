import axios from "axios";
import * as jwt from "jsonwebtoken";
import * as express from "express";
import error405 from "../errors/error405";
import testAuthMiddleware from "../middleware/testAuthMiddleware"
const commandes = express.Router();

commandes.get("/", testAuthMiddleware, async (req, res, next) => {

  let tokenData

  jwt.verify((res.locals.token = req.query.token || req.headers["x-lbs-token"]) as string, process.env.SECRETPASSWDTOKEN || '', (err: any, decode: any) => {
    if (err) {
      res.status(403).json({
        code: 403,
        message: err.message
      });
      
    } else {
      tokenData = decode;
    }
  })

  if(!tokenData) return;
  try {
    // @ts-ignore
    axios.get(`${process.env.PRISE_COMMANDE}/commande/${tokenData.id}`)
      .then(function (response) {
        res.status(201).json(response.data);
      })
      .catch(function (error) {
        next(error);
      });

  } catch (error) {
    next(error);
  }
  
});

commandes.post("/", testAuthMiddleware, async (req, res, next) => {

  try {
    // @ts-ignore
    axios.post(`${process.env.PRISE_COMMANDE}/commande`, req.body, { headers:{authorization: ""+ res.locals.token}})
      .then(function (response) {
        res.status(201).json(response.data);
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