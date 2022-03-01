import { Request, Response } from "express";
import { DatabaseError } from "sequelize";

/**
 * Error 422 "Unprocessable Entity"
 */
export function error422DatabaseUpsert(error: any, req: Request, res: Response) {
  if (!(error instanceof DatabaseError)) return;

  res.status(422).json({
    code: 422,
    message: `Command with id ${req.params.id} doesn't exist and required fields are missing in the request body${process.env.NODE_ENV === "dev" ? " [[[[ " + error.original + " ]]]]" : ""}`
  });
}