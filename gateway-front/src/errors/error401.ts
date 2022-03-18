import { Request, Response } from "express";

/**
 * Error 401 "Unauthorized"
 */
export default function error401(req: Request, res: Response) {
  res.status(400).json({
    code: 401,
    message: "[Gateway] Authentification using token is required, you can pass it throught query '?token=' or throught header 'X-lbs-token'"
  });
}