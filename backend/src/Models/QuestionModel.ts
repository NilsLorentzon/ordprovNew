import mongoose from "mongoose";
import { z } from "zod";
export const QuestionValidation = z.object({
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
  generatedTime: z.coerce.date(),
  answeredTime: z.coerce.date(),
  quizType: z.enum(["multipleChoice", "writeDefinition"]),
  writenDefinitionAnswer: z.string().max(500),
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
  quizType: String,
  writenDefinitionAnswer: String,
});

questionSchema.index({ userId: 1, generatedTime: 1 });
export const QuestionModel = mongoose.model("Question", questionSchema);
