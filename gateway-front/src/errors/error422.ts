import { Request, Response } from "express";
import { ValidationError } from "joi";
import { DatabaseError } from "sequelize";

/**
 * Error 422 "Unprocessable Entity"
 */
export function error422DatabaseUpdate(error: any, req: Request, res: Response) {
  if (!(error instanceof DatabaseError)) return;

  res.status(422).json({
    code: 422,
    message: `[Gateway] Required fields are missing in the request body ${process.env.NODE_ENV === "dev" ? " [[[[ " + error.original + " ]]]]" : ""}`
  });
}

export function error422Validation(error: ValidationError, req: Request, res: Response) {
  res.status(422).json({ code: 422, message: "[Gateway] " + error.details.map(details => details.message).join(", ").replaceAll("\\\"", "'") });
  return;
}