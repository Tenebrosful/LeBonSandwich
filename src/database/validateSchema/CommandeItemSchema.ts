import * as Joi from "joi";

const CommandeItemSchema = Joi.object({
  libelle: Joi.string().alphanum(),
  quantite: Joi.number().positive().greater(0).integer(),
  tarif: Joi.number().positive().precision(2),
  uri: Joi.string(),
});

export default CommandeItemSchema;