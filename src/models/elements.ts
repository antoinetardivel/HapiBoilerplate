import { Schema, model } from 'mongoose';

const elementSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    description: String,
  },
  {
    timestamps: true,
  },
);

export default model('Task', elementSchema);
