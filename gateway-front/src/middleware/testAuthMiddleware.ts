import error401 from "../errors/error401";
import axios from "axios";
import { NextFunction, Request, Response } from "express";

export default async function testAuthMiddleware(req: Request, res: Response, next: NextFunction){
    if(!req.query.token && !req.headers["x-lbs-token"])
        res.status(403).json({
            code: 403,
            message: "You are not connected"
          });
     else {
        res.locals.token = req.query.token || req.headers["x-lbs-token"];
        try {
          axios.post(`${process.env.AUTHENTIFICATION}/tokenVerify`, {}, { headers:{authorization: ""+ res.locals.token}})
            .then(function () {
              next();
            })
            .catch(function (error) {
              next(error);
            });
            return;
        } catch (error) {
          next(error);
        }
    }
  
    error401(req, res);
  }