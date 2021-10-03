import * as joi from 'joi';

export const userValidator = joi
  .object()
  .keys({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().required(),
  })
  .unknown(false);

export const createUserValidator = joi
  .object()
  .keys({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    password: joi.string().required(),
    passwordConfirmation: joi.string().required(),
    email: joi.string().required(),
  })
  .unknown(false);

export const updateUserValidator = joi
  .object()
  .keys({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    email: joi.string().required(),
  })
  .unknown(false);

export const updateUserPasswordValidator = joi
  .object()
  .keys({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    newPasswordConfirmation: joi.string().required(),
  })
  .unknown(false);

export const resetUserPasswordValidation = joi
  .object()
  .keys({
    newPassword: joi.string().required(),
    newPasswordConfirmation: joi.string().required(),
    resetPasswordToken: joi.string().required(),
  })
  .unknown(false);

export const activeUserValidation = joi
  .object()
  .keys({
    activeAccountToken: joi.string().required(),
  })
  .unknown(false);
