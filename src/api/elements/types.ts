import { getModelForClass, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class Element {
  public _id?: Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, default: '' })
  public description!: string;
}

export const elementModel = getModelForClass(Element);
