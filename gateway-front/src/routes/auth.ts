import axios from "axios";
import * as express from "express";
import error405 from "../errors/error405";
const auth = express.Router();

auth.post("/signin", async (req, res, next) => {

  try {
    axios.post(`${process.env.AUTHENTIFICATION}/`, req.body)
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

auth.post("/signup", async (req, res, next) => {

  try {
    axios.post(`${process.env.AUTHENTIFICATION}/`, req.body)
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

auth.use("/", error405);

export default auth;