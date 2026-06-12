import mongoose from "mongoose";
import { z } from "zod";
export const spacedRepetitionValidation = z.object({
  userId: z.string(),
  word: z.string(),
  knowledgeLevel: z.number().int().min(1).max(5),
  nextAllowedUpgrade: z.coerce.date(),
});

export type SpacedRepetition = z.infer<typeof spacedRepetitionValidation>;
const spacedRepetitionSchema = new mongoose.Schema<SpacedRepetition>({
  userId: String,
  word: String,
  knowledgeLevel: Number,
  nextAllowedUpgrade: Date,
});

spacedRepetitionSchema.index({ userId: 1, word: 1 }, { unique: true });
export const SpacedRepetitionModel = mongoose.model(
  "SpacedRepetition",
  spacedRepetitionSchema,
);
