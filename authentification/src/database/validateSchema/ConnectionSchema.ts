import * as Joi from "joi";

const UserSchema = Joi.object({
  passwd: Joi.string().alphanum(),
  mail: Joi.string().email(),
});

export default UserSchema;