import mongoose from "mongoose";
import { z } from "zod";
export const QuestionValidation = z.object({
  userId: z.string(),
  word: z.string(),
  alternativeWords: z.array(z.string()),
  answer: z.string(),
  isCorrect: z.boolean(),
  generatedTime: z.coerce.date(),
  answeredTime: z.coerce.date(),
});

export type Question = z.infer<typeof QuestionValidation>;
const questionSchema = new mongoose.Schema<Question>({
  userId: String,
  word: String,
  alternativeWords: [String],
  answer: String,
  isCorrect: Boolean,
  generatedTime: Date,
  answeredTime: Date,
});

export const QuestionModel = mongoose.model("Question", questionSchema);
