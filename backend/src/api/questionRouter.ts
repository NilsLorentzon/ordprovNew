import express from "express";
import { z } from "zod";
import { QuestionModel } from "../Models/QuestionModel";
import { upgradeKnowledgeLevel } from "./spacedRepetitionRouter";

const questionRouter = express.Router();

questionRouter.post("/", async (req, res) => {
  const userStorageId = (req as any).currentStorageUserId;
  const zodValidation = z.object({
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
  });
  const validationResult = zodValidation.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const questionData = validationResult.data;
  const userId = req.currentUserId;

  if (userId) {
    (questionData as any).userId = userId;
  } else if (userStorageId) {
    (questionData as any).userId = userStorageId;
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // (questionData as any).userStorageId = userStorageId;
  const questionDocument = new QuestionModel(questionData);
  await questionDocument.save();

  await upgradeKnowledgeLevel({
    userId: questionDocument.userId,
    word: questionDocument.word,
    quizType: questionDocument.quizType,
    isCorrect: questionDocument.isCorrect,
  });
  // if (questionDocument.isCorrect === false) {
  //   RepetitionModel.findOneAndUpdate(
  //     { userId: questionDocument.userId, word: questionDocument.word },
  //     { userId: questionDocument.userId, word: questionDocument.word },
  //     { upsert: true, new: true },
  //   ).exec();
  //   // console.log("Saved repetition for user:", questionDocument.userId, "word:", questionDocument.word);
  // }
  return res.json({ message: "Question saved successfully" });
});

export default questionRouter;
