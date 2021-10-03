import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class User {
  public _id?: Types.ObjectId;

  @prop()
  public firstname!: String;

  @prop()
  public lastname!: String;

  @prop({ select: false, required: true })
  public password!: String;

  @prop({ select: false })
  public passwordConfirmation?: String;

  @prop({ select: false })
  public oldPassword?: String;

  @prop({ select: false })
  public newPassword?: String;

  @prop({ select: false })
  public newPasswordConfirmation?: String;

  @prop({ required: true, unique: true, index: true })
  public email!: String;

  @prop({ default: false, required: true })
  public isActive?: Boolean;

  @prop({ default: false })
  public passwordForgotten?: boolean;

  @prop({ select: false })
  public registrationToken?: string;

  public static async findbyEmail(
    this: ReturnModelType<typeof User>,
    email: string
  ) {
    return this.findOne(
      { email },
      {
        _id: 1,
        email: 1,
        password: 1,
        firstname: 1,
        lastname: 1,
        isActive: 1,
        registrationToken: 1,
      }
    ).exec();
  }
}

export const userModel = getModelForClass(User);
