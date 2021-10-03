import { Boom, notFound } from "@hapi/boom";
import { hash, compare } from "bcrypt";
import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userModel } from "./types";
import { IRequest } from "../../interfaces/request";
import { auth } from "../../config/config";
import { JWT } from "../../core/JWT";
import { sendActivationEmail } from "./services";

interface activateAccountPayload {
  activeAccountToken: string;
}

export class UsersController {
  async createUser(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    try {
      const userPayload = req.payload as User;

      userPayload.isActive = false;

      if (userPayload.password != userPayload.passwordConfirmation)
        return notFound("The password confirmation doesn't match.");

      const hashedPassword = await hash(userPayload.password, auth.saltRounds);
      userPayload.password = hashedPassword;
      delete userPayload.passwordConfirmation;
      const user = await userModel.create<User>(userPayload);

      sendActivationEmail(user, user._id);

      return h.response({ userId: user._id }).code(201);
    } catch (err) {
      console.error("Error during creation ", err);
      return h.response(err).code(500);
    }
  }

  async getUsers(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    try {
      if (req.params.id) {
        const user = await userModel
          .findById(req.params.id)
          .lean({ autopopulate: true });

        if (!user) return notFound("Users doesn't exist.");

        return h.response(user);
      }

      const users = await userModel.find().lean({ autopopulate: true });

      if (!users) return notFound("Users doesn't exist.");

      return h.response(users);
    } catch (err) {
      console.error("Error during proces ", err);
      return h.response(err).code(500);
    }
  }

  async updateUser(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    try {
      const userPayload = req.payload as User;

      const user = await userModel
        .findById(req.params.id, { firstname: 1, lastname: 1, email: 1 })
        .lean();
      if (!user) return notFound("Users doesn't exist.");

      await userModel.updateOne(
        { _id: user._id },
        { ...userPayload, id: user._id }
      );

      return h.response({ userId: user._id }).code(201);
    } catch (err) {
      console.error("Error during update ", err);
      return h.response(err).code(500);
    }
  }
  async updateUserPassword(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    try {
      const userPayload = req.payload as User;

      const user = await userModel
        .findById(req.params.id, { password: 1 })
        .lean({ autopopulate: true });

      if (!user) return notFound("Users doesn't exist.");

      if (user.password !== userPayload.oldPassword)
        return notFound("Old password doesn't match.");

      if (userPayload.newPassword !== userPayload.newPasswordConfirmation)
        return notFound(
          "New password and new password confirmation doesn't match."
        );

      await userModel.updateOne(
        { _id: user._id },
        { id: user._id, password: userPayload.newPassword }
      );

      return h.response({ userId: user._id }).code(201);
    } catch (err) {
      console.error("Error during update ", err);
      return h.response(err).code(500);
    }
  }

  async updateUserActivationState(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    const { activeAccountToken } = req.payload as activateAccountPayload;
    const decodedToken = await JWT.decode(activeAccountToken);
    const user = await userModel
      .findById(decodedToken.id, "isActive registrationToken ")
      .lean();

    if (!user) return notFound("No user found with that id");

    if (!user.isActive && user.registrationToken === activeAccountToken) {
      user.isActive = true;
      user.registrationToken = undefined;

      await userModel.updateOne({ _id: decodedToken.id }, user);

      return h.response({ ...user }).code(200);
    }
  }

  async deleteUsers(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    try {
      await userModel.deleteOne({ _id: req.params.id });
      return h.response().code(204);
    } catch (err) {
      console.error("Error during deletion ", err);
      return h.response(err).code(500);
    }
  }
}
