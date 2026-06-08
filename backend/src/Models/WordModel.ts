import mongoose from "mongoose";
import { z } from "zod";
export const WordValidation = z.object({
  word: z.string(),
  createdTime: z.coerce.date(),
  definitions: z.object({
    shortDefinition: z.string(),
    definition: z.string(),
    longDefinition: z.string(),
  }),
  sentences: z.array(z.string()),
  partsOfSpeech: z.array(z.string()),
  
});

export type Word = z.infer<typeof WordValidation>;
const wordSchema = new mongoose.Schema<Word>({
  word:  {type: String, unique: true},
  createdTime: Date,
  definitions: {
    shortDefinition: String,
    definition: String,
    longDefinition: String,
  },
  sentences: [String],
  partsOfSpeech: [String],
});

wordSchema.index({ word: 1 });
export const WordModel = mongoose.model("Word", wordSchema);
