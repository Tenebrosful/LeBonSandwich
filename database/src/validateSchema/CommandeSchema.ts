import * as Joi from "joi";

const CommandeSchema = Joi.object({
  livraison: Joi.date().greater("now"),
  mail: Joi.string().email(),
  nom: Joi.string().alphanum()
});

export default CommandeSchema;