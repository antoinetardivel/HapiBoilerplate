import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class Element {
  public _id?: Types.ObjectId;

  @prop({ required: true })
  public name!: String;

  @prop({ required: true, default: "" })
  public description!: String;
}

export const elementModel = getModelForClass(Element);
