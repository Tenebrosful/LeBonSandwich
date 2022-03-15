import { decode, verify } from "jsonwebtoken";
import error401 from "../errors/error401";
import axios from "axios";
import { NextFunction, Request, Response } from "express";

export default async function testAuthMiddleware(req: Request, res: Response, next: NextFunction){
    if(!req.query.token && !req.headers["x-lbs-token"]){
        res.status(403).json({
            code: 403,
            message: `You are not connected`
          });
    } else {
        res.locals.token = req.query.token || req.headers["x-lbs-token"];
        verify(res.locals.token, 'RANDOM_TOKEN_SECRET', (err: any, decode: any) => {
                if (err) {
                    res.status(403).json({
                        code: 403,
                        message: err.message
                    });
                } else {

                    try {
                        axios.post(`${process.env.AUTHENTIFICATION}/tokenVerify`, {}, { headers:{authorization: ""+ res.locals.token}})
                          .then(function () {
                            res.status(201);
                          })
                          .catch(function (error) {
                            next(error);
                          });
                    
                      } catch (error) {
                        next(error);
                      }
                }
            })
    }
  
    if (res.locals.token) { next(); return; }
  
    error401(req, res);
  }