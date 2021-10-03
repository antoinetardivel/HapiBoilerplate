// import { sendTemplatedEmail } from "./../../../services/mailer";
import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userModel } from "../users/types";
import { unauthorized, Boom, notFound, badRequest } from "@hapi/boom";
import { compare, hash } from "bcrypt";
import { JWT, IJwtPayload } from "../../core/JWT";
import { clientUrl, auth, mj } from "../../config/config";
import { IAuthPayload } from "../../interfaces/auth";
import { IRequest } from "../../interfaces/request";
import { sendTemplatedEmail } from "../../services/mailer";

interface resetPasswordPayload {
  resetToken: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

interface forgotPasswordPayload {
  email: string;
}

export class AuthController {
  async login(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    const payload = req.payload as IAuthPayload;

    // See if the user exist and get his information
    const user = await userModel.findbyEmail(payload.email);

    // Unauthorized if not good email
    if (!user) return unauthorized("Email or password incorrect.");

    const validPassword = await compare(
      payload.password,
      user?.password as string
    );

    // Unauthorized if not good password
    if (!validPassword) return unauthorized("Email or password incorrect.");

    // Check if unconfirmed
    // if (!user.isActive) return unauthorized("Account not confirmed");

    // Creating token
    const jwtPayload: IJwtPayload = {
      id: user._id,
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email,
    };

    // Returning token
    return h.response({ token: await JWT.encode(jwtPayload) });
  }

  async forgotPassword(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    const { email } = req.payload as forgotPasswordPayload;
    const user = await userModel.findbyEmail(email);

    if (!user) return notFound("No user found with the given email.");

    user.passwordForgotten = true;
    await userModel.updateOne({ _id: user._id }, user);

    const resetToken = await JWT.encode({ email: user.email, id: user._id });
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    await sendTemplatedEmail(
      mj.templates.FORGOT_PASSWORD,
      user.email,
      user.firstname + " " + user.lastname || "user" || "user",
      {
        password_reset_link: resetLink,
      }
    );

    return h.response({ resetToken: resetToken });
  }

  async resetPassword(
    req: IRequest,
    h: ResponseToolkit
  ): Promise<ResponseObject | Boom> {
    const { newPassword, newPasswordConfirmation, resetToken } =
      req.payload as resetPasswordPayload;
    const data = await JWT.decode(resetToken);
    const user = await userModel.findById(data.id).lean();

    if (newPassword !== newPasswordConfirmation)
      return notFound("New password and confirmation doesn't match.");

    if (!user) return notFound("No user found with the given id.");

    if (!user.passwordForgotten)
      return unauthorized("Not authorized to perform this action.");

    if (data.email === user.email) {
      const hashedPassword = await hash(newPassword, auth.saltRounds);
      user.password = hashedPassword;
      user.passwordForgotten = false;
      await userModel.updateOne({ _id: user._id }, user);

      //   await sendTemplatedEmail(
      //     mj.templates.PASSWORD_CHANGE_SUCCESS,
      //     user.email,
      //     user.firstname + " " + user.firstname || "user",
      //     {
      //       name: user.firstname + " " + user.firstname || "user",
      //     }
      //   );

      return h.response().code(204);
    }

    return badRequest();
  }
}
