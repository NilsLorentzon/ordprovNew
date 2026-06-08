import mongoose from "mongoose";
import { z } from "zod";
export const RepetitionValidation = z.object({
  userId: z.string(),
  word: z.string(),
});

export type Repetition = z.infer<typeof RepetitionValidation>;
const repetitionSchema = new mongoose.Schema<Repetition>({
  userId: String,
  word: String,
});

repetitionSchema.index({ userId: 1, word: 1 }, { unique: true });
export const RepetitionModel = mongoose.model("Repetition", repetitionSchema);
