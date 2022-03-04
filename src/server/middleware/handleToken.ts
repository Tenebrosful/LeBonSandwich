import { NextFunction, Request, Response } from "express";
import error401 from "../errors/error401";

export default function handleTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  res.locals.token = req.query.token || req.headers["X-lbs-token"];

  if (res.locals.token) next();

  error401(req, res);
}