import * as joi from "joi";

const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
const objectId = joi.string().regex(objectIdRegExp);
export const objectIdValidator = joi.object().keys({ id: objectId });

export const elementValidator = joi
  .object()
  .keys({
    name: joi.string(),
    description: joi.string(),
  })
  .unknown(false);
