import mongoose from "mongoose";
import { z } from "zod";
const WordValidation = z.object({
  word: z.string(),
  definitions: z.object({
    shortDefinition: z.string(),
    definition: z.string(),
    longDefinition: z.string(),
  }),
  sentences: z.array(z.string()),
  partsOfSpeech: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  
});

export type Word = z.infer<typeof WordValidation>;


const wordSchema = new mongoose.Schema<Word>({
  word:  {type: String, unique: true},
  definitions: {
    shortDefinition: String,
    definition: String,
    longDefinition: String,
  },
  sentences: [String],
  partsOfSpeech: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

wordSchema.index({ word: 1 });
export const WordModel = mongoose.model("Word", wordSchema);
