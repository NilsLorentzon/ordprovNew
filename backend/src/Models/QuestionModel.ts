import mongoose from "mongoose";
import { z } from "zod";
const QuestionValidation = z.object({
  userId: z.string().max(100),
  word: z.string().max(100),
  alternativeWords: z.array(
    z.object({
      word: z.string().max(100),
      definition: z.string().max(100),
    }),
  ),
  correctAnswer: z.string().max(100),
  answer: z.string().max(100),
  isCorrect: z.boolean(),
  quizType: z.enum(["multipleChoice", "writeDefinition"]),
  writenDefinitionAnswer: z.string().max(500),
  createdAt: z.coerce.date(),
  answeredAt: z.coerce.date(),
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
  quizType: String,
  writenDefinitionAnswer: String,
  createdAt: { type: Date, default: Date.now },
  answeredAt: { type: Date, default: Date.now },
});

questionSchema.index({ userId: 1, createdAt: 1 });
export const QuestionModel = mongoose.model("Question", questionSchema);
