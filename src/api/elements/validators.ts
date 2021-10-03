import * as joi from "joi";

export const elementValidator = joi
  .object()
  .keys({
    name: joi.string(),
    description: joi.string(),
  })
  .unknown(false);
