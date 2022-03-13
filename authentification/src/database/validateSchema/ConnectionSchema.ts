import * as Joi from "joi";

const UserSchema = Joi.object({
  mail: Joi.string().email(),
  passwd: Joi.string().alphanum(),
});

export default UserSchema;