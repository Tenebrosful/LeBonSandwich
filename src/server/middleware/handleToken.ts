import { NextFunction, Request, Response } from "express";
import error401 from "../errors/error401";

export default function handleToken(req: Request, res: Response, next: NextFunction) {
  res.locals.token = req.query.token || req.headers["x-lbs-token"];

  if (res.locals.token) { next(); return; };

  error401(req, res);
}