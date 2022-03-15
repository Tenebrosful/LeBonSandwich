import * as express from "express";
import { User } from "../database/models/User";
import UserSchema from "../database/validateSchema/UserSchema";
import ConnectionSchema from "../database/validateSchema/ConnectionSchema";
import handleDataValidation from "../middleware/handleDataValidation";
import * as jwt from "jsonwebtoken";
import error405 from "../errors/error405";
import { generate as passwordHash, verify as passwordVerify} from "password-hash";
import { ObjectEncodingOptions } from "fs";
const users = express.Router();

users.post("/", async (req, res, next) => {

  const userFields = {
    passwd: req.body.passwd,
    mail: req.body.mail,
    nom: req.body.nom,
  };

  if (!handleDataValidation(UserSchema, userFields, req, res, true)) return;

  if(req.body.status){
    (userFields as any).status = req.body.status;
  }

  userFields.passwd = passwordHash(userFields.passwd);

  try {
    const user = await User.create({ ...userFields });
    const token = jwt.sign(
      { id: user.id, status: user.status, nom: user.nom, mail: user.mail },
      "RANDOM_TOKEN_SECRET", { expiresIn: '1h' });
    user.token = token;
    if (user) {

      const resData = {
        user: {
          created_at: user.created_at,
          mail: user.mail,
          nom: user.nom,
          token: token,
        },
        type: "resource",
      };

      res.status(201).json(resData);
    }
  } catch (error) {
    next(error);
  }

});

users.post("/auth", async (req, res, next) => {
  
  const userFields = {
    passwd: req.body.passwd,
    mail: req.body.mail,
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

      if(passwordVerify(userFields.passwd, user.passwd)){
        const token = jwt.sign(
          { token: user.id, status: user.status, nom: user.nom, mail: user.mail },
          "RANDOM_TOKEN_SECRET", { expiresIn: '1h' });
          res.status(200).json({token});
      }else {
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

  console.log(req.headers['authorization']);
  
  const tokenData = jwt.verify(req.headers['authorization'] as string, "RANDOM_TOKEN_SECRET") as Object
  
  try {
    const user = await User.findOne(
      {
        attributes: ["id", "mail", "nom", "created_at", "cumul_achats", "status", "passwd"],
        where: { id: tokenData.token}
        
      });

      if (!user) {
        
        res.status(404).json({
          code: 404,
          message: `No user found with mail ${userFields.mail}`
        });
        return;
      }

      if(passwordVerify(userFields.passwd, user.passwd)){
        const token = jwt.sign(
          { token: user.id, status: user.status, nom: user.nom, mail: user.mail },
          "RANDOM_TOKEN_SECRET", { expiresIn: '1h' });
          res.status(200).json({token});
      }else {
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
  
users.use("/", error405);

export default users;