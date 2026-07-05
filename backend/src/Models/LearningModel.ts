import mongoose from "mongoose";
import { createEmptyCard } from "ts-fsrs";
import { z } from "zod";

interface LearningCard {
  userId: string;
  cardId: string;
  word: string;
  createdAt: Date;

  // FSRS Specific Fields:
  due: Date; // Next review date
  stability: number; // Memory stability
  difficulty: number; // Card difficulty
  elapsed_days: number; // Days elapsed since last review
  scheduled_days: number; // Scheduled days until next review
  reps: number; // Total repetitions
  lapses: number; // Times forgotten
  state: number; // Card state (0: New, 1: Learning, 2: Review, 3: Relearning)
}
const LearningModelValidation = z.object({
  userId: z.string(),
  cardId: z.string(),
  word: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  due: z.date(),
  stability: z.number(),
  difficulty: z.number(),
  elapsed_days: z.number(),
  scheduled_days: z.number(),
  reps: z.number(),
  lapses: z.number(),
  state: z.number(),
  last_review: z.date().optional(),
});
// export const ReportSanitation = z.object({
//   title: z.string().max(100),
//   content: z.string().min(10).max(1000),
// });

export type Learning = z.infer<typeof LearningModelValidation>;
const learningSchema = new mongoose.Schema<Learning>({
  userId: String,
  cardId: String,
  word: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  due: Date,
  stability: Number,
  difficulty: Number,
  elapsed_days: Number,
  scheduled_days: Number,
  reps: Number,
  lapses: Number,
  state: Number,
});

export const LearningModel = mongoose.model("Learning", learningSchema);
