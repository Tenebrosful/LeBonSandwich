import error401 from "../errors/error401";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default async function testAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.tokenCommande = req.query.tokenCommande || req.headers["x-lbs-tokenCommande"];
    console.log(req.headers["x-lbs-tokenCommande"]);
    
    if (!res.locals.tokenCommande) {
        res.status(403).json({
            code: 403,
            message: "You are not connected"
        });
        return;
    } else {
        jwt.verify(res.locals.tokenCommande, process.env.SECRETPASSWDTOKEN || "", (err: any, decode: any) => {
            if (err)
                res.status(403).json({
                    code: 403,
                    message: err.message
                });
        });
        next();
        return;
    }

    error401(req, res);
}