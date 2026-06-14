import mongoose from "mongoose";
import { z } from "zod";
const spacedRepetitionValidation = z.object({
  userId: z.string(),
  word: z.string(),
  knowledgeLevel: z.number().int().min(1).max(5),
  nextAllowedUpgrade: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});


export type SpacedRepetition = z.infer<typeof spacedRepetitionValidation>;
const spacedRepetitionSchema = new mongoose.Schema<SpacedRepetition>({
  userId: String,
  word: String,
  knowledgeLevel: Number,
  nextAllowedUpgrade: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

spacedRepetitionSchema.index({ userId: 1, word: 1 }, { unique: true });
export const SpacedRepetitionModel = mongoose.model(
  "SpacedRepetition",
  spacedRepetitionSchema,
);
