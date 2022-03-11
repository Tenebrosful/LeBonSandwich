import { Request, Response } from "express";
import { ObjectSchema } from "joi";
import { error422Validation } from "../errors/error422";

export default function handleDataValidation(validationSchema: ObjectSchema, data: Record<string, unknown>, req: Request, res: Response, allRequired = false) {
  const { error: validationError } = validationSchema.validate(data, {presence: (allRequired ? "required" : "optional")});

  if (validationError) {
    error422Validation(validationError, req, res);
    return false;
  }

  return true;
}