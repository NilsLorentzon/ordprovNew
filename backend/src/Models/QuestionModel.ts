import mongoose from "mongoose";
import { z } from "zod";
export const QuestionValidation = z.object({
  userId: z.string(),
  word: z.string(),
  alternativeWords: z.array(z.object({
    word: z.string(),
    definition: z.string(),
  })),
  correctAnswer: z.string(),
  answer: z.string(),
  isCorrect: z.boolean(),
  generatedTime: z.coerce.date(),
  answeredTime: z.coerce.date(),
});

export type Question = z.infer<typeof QuestionValidation>;
const questionSchema = new mongoose.Schema<Question>({
  userId: String,
  word: String,
  alternativeWords: [
    {
      word: String,
      definition: String,
    },
  ],
  correctAnswer: String,
  answer: String,
  isCorrect: Boolean,
  generatedTime: Date,
  answeredTime: Date,
});

questionSchema.index({ userId: 1,  generatedTime: 1 });
export const QuestionModel = mongoose.model("Question", questionSchema);
