import * as joi from "joi";

export const loginValidator = joi
  .object()
  .keys({
    password: joi.string().required(),
    email: joi.string().email().lowercase().required(),
  })
  .unknown(false);

export const forgotPasswordValidator = joi
  .object()
  .keys({ email: joi.string().required() });

export const resetPasswordValidator = joi
  .object()
  .keys({
    newPassword: joi.string().required(),
    newPasswordConfirmation: joi.string().required(),
    resetToken: joi.string().required(),
  })
  .unknown(false);
