import mongoose from "mongoose";
import { z } from "zod";
export const RepetitionValidation = z.object({
  userId: z.string(),
  word: z.string(),
  alternativeWords: z.array(z.string()),
  answer: z.string(),
  isCorrect: z.boolean(),
  generatedTime: z.coerce.date(),
  answeredTime: z.coerce.date(),
});

export type Repetition = z.infer<typeof RepetitionValidation>;
const repetitionSchema = new mongoose.Schema<Repetition>({
  userId: String,
  word: String,
  alternativeWords: [String],
  answer: String,
  isCorrect: Boolean,
  generatedTime: Date,
  answeredTime: Date,
});

export const RepetitionModel = mongoose.model("Repetition", repetitionSchema);
