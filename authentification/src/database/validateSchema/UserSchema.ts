import * as Joi from "joi";

const UserSchema = Joi.object({
  mail: Joi.string().email(),
  nom: Joi.string().alphanum(),
  passwd: Joi.string().alphanum(),
});

export default UserSchema;