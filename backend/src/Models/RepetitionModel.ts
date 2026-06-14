import mongoose from "mongoose";
import { z } from "zod";
const RepetitionValidation = z.object({
  userId: z.string(),
  word: z.string(),
  createdAt: z.coerce.date(),
});

export type Repetition = z.infer<typeof RepetitionValidation>;
const repetitionSchema = new mongoose.Schema<Repetition>({
  userId: String,
  word: String,
  createdAt: { type: Date, default: Date.now },
});

repetitionSchema.index({ userId: 1, word: 1 }, { unique: true });
export const RepetitionModel = mongoose.model("Repetition", repetitionSchema);
