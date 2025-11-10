import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  clientEmail: string;
  comment: string;
}

export interface ITrainerTraining {
  trainingId: string;
}

export interface ITrainer extends Document {
  email: string;
  trainigTypes: string[];
  address: string;
  trainings: ITrainerTraining[];
  comments: IComment[];
}

const TrainerTrainingSchema = new Schema<ITrainerTraining>({
  trainingId: { type: String, required: true },
});

const CommentSchema = new Schema<IComment>({
  clientEmail: { type: String, required: true },
  comment: { type: String, required: true },
});

const TrainerSchema = new Schema<ITrainer>({
  email: { type: String, unique: true, required: true },
  trainigTypes: [{ type: String, required: true }],
  address: { type: String, required: true },
  trainings: [TrainerTrainingSchema],
  comments: [CommentSchema],
});

export const Trainer: Model<ITrainer> =
  mongoose.models.Trainer || mongoose.model<ITrainer>("Trainer", TrainerSchema);

export default Trainer;
