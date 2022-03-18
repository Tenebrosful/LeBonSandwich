import * as express from "express";
import { User } from "../database/models/User";
import UserSchema from "../database/validateSchema/UserSchema";
import ConnectionSchema from "../database/validateSchema/ConnectionSchema";
import handleDataValidation from "../middleware/handleDataValidation";
import * as jwt from "jsonwebtoken";
import error405 from "../errors/error405";
import { generate as passwordHash, verify as passwordVerify } from "password-hash";
import { ObjectEncodingOptions } from "fs";
const users = express.Router();

users.post("/", async (req, res, next) => {

  const userFields = {
    mail: req.body.mail,
    nom: req.body.nom,
    passwd: req.body.passwd,
  };

  if (!handleDataValidation(UserSchema, userFields, req, res, true)) return;

  if (req.body.status) {
    (userFields as any).status = req.body.status;


    userFields.passwd = passwordHash(userFields.passwd);

    try {
      const user = await User.create({ ...userFields });
      const token = jwt.sign(
        { id: user.id, status: user.status, nom: user.nom, mail: user.mail },
        process.env.SECRETPASSWDTOKEN || '', { expiresIn: '1h' });
      user.token = token;
      if (user) {

        const resData = {
          type: "resource",
          user: {
            created_at: user.created_at,
            mail: user.mail,
            nom: user.nom,
            token: token,
          },
        };

        res.status(201).json(resData);
      }
    } catch (error) {
      next(error);
    }
  }
});

users.post("/auth", async (req, res, next) => {

  const userFields = {
    mail: req.body.mail,
    passwd: req.body.passwd,
  };

  if (!handleDataValidation(ConnectionSchema, userFields, req, res, true)) return;

  try {
    const user = await User.findOne(
      {
        attributes: ["id", "mail", "nom", "created_at", "cumul_achats", "status", "passwd"],
        where: { mail: req.body.mail }

      });

    if (!user) {

      res.status(404).json({
        code: 404,
        message: `No user found with mail ${userFields.mail}`
      });
      return;
    }

    if (passwordVerify(userFields.passwd, user.passwd)) {
      const token = jwt.sign(
        { id: user.id, status: user.status, nom: user.nom, mail: user.mail },
        process.env.SECRETPASSWDTOKEN || '', { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(403).json({
        code: 403,
        message: `Password is not valid`
      });

      return;
    }

  } catch (error) {
    next(error);
  }

});

users.post("/tokenVerify", async (req, res, next) => {

  let tokenData

  jwt.verify(req.headers['authorization'] as string, process.env.SECRETPASSWDTOKEN || '', (err: any, decode: any) => {
    if (err) {
      res.status(403).json({
        code: 403,
        message: err.message
      });

    } else {
      tokenData = decode;
    }
  })

  if (!tokenData) return;

  try {
    const user = await User.findOne(
      {
        attributes: ["id", "mail", "nom", "created_at", "cumul_achats", "status", "passwd"],
        // @ts-ignore
        where: { id: tokenData.id }

      });

    if (!user) {

      res.status(404).json({
        code: 404,
        // @ts-ignore
        message: `No user found with mail ${tokenData.mail}`
      });
      return;
    }

    res.status(200).json(user);

  } catch (error) {
    next(error);
  }

});

users.use("/", error405);

export default users;