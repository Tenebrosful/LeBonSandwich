import * as Joi from "joi";

const CommandeSchema = Joi.object({
  client_id: Joi.string().uuid(),
  livraison: Joi.date().greater("now"),
  mail: Joi.string().email(),
  nom: Joi.string().alphanum()
});

export default CommandeSchema;