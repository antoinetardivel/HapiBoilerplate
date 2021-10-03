import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class User {
  public _id?: Types.ObjectId;

  @prop()
  public firstname!: string;

  @prop()
  public lastname!: string;

  @prop({ select: false, required: true })
  public password!: string;

  @prop({ select: false })
  public passwordConfirmation?: string;

  @prop({ select: false })
  public oldPassword?: string;

  @prop({ select: false })
  public newPassword?: string;

  @prop({ select: false })
  public newPasswordConfirmation?: string;

  @prop({ required: true, unique: true, index: true })
  public email!: string;

  @prop({ default: false, required: true })
  public isActive?: boolean;

  @prop({ default: false })
  public passwordForgotten?: boolean;

  @prop({ select: false })
  public registrationToken?: string;

  public static async findbyEmail(this: ReturnModelType<typeof User>, email: string) {
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
      },
    ).exec();
  }
}

export const userModel = getModelForClass(User);
