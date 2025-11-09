import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavorite {
  email: string; // trainer's email
}

export interface ITrainee extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  isTrainer: boolean;
  favorites: IFavorite[];
}

const FavoriteSchema = new Schema<IFavorite>({
  email: { type: String, required: true },
});

const TraineeSchema = new Schema<ITrainee>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  isTrainer: { type: Boolean, default: false },
  favorites: [FavoriteSchema],
});

export const Trainee: Model<ITrainee> =
  mongoose.models.Trainee || mongoose.model<ITrainee>("Trainee", TraineeSchema);

export default Trainee;
