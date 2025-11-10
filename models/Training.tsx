import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITraining extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  trainer: string; // trainer's email
  client: string[]; // clients' emails
  type: string;
  address: string;
  classType: "personal" | "group";
  status: "sent" | "approved" | "rejected";
}

const TrainingSchema = new Schema<ITraining>({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  trainer: { type: String, required: true },
  client: [{ type: String, required: true }],
  type: { type: String, required: true },
  address: { type: String, required: true },
  classType: { type: String, enum: ["personal", "group"], required: true },
  status: { type: String, enum: ["sent", "approved", "rejected"], required: true },
});

export const Training: Model<ITraining> =
  mongoose.models.Training || mongoose.model<ITraining>("Training", TrainingSchema);

export default Training;
