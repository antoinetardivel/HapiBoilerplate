import { Types } from "mongoose";
import { clientUrl, mj } from "../../config/config";
import { JWT } from "../../core/JWT";
import { User, userModel } from "./types";
import { sendTemplatedEmail } from "../../services/mailer";

export const sendActivationEmail = async (
  user: User,
  userId: Types.ObjectId
): Promise<boolean> => {
  const emailConfirmationToken = await JWT.encode({
    email: user.email,
    id: userId,
  });
  const emailConfirmationLink = `${clientUrl}/activate-account/${emailConfirmationToken}`;

  await sendTemplatedEmail(
    mj.templates.ACTIVATE_ACCOUNT,
    user.email,
    user.firstname + " " + user.lastname || "user",
    {
      account_activation_link: emailConfirmationLink,
      name: user.firstname + " " + user.lastname || "user",
    }
  );
  console.log(emailConfirmationToken);

  user.registrationToken = emailConfirmationToken;

  try {
    await userModel.updateOne({ _id: userId }, user);
    return true;
  } catch (err) {
    console.error("Error during sending the email ", err);
    return false;
  }
};
