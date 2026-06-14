import express from "express";
import { z } from "zod";
import { RepetitionModel } from "../Models/RepetitionModel";
import { SpacedRepetitionModel } from "../Models/SpacedRepetitionModel";
import { exhasutiveMatchingGuard } from "../utils/utils";
import { QuizTypes } from "../types/types";

const spacedRepetitionRouter = express.Router();

export const upgradeKnowledgeLevel = async ({
  userId,
  word,
  quizType,
  isCorrect,
}: {
  userId: string;
  word: string;
  quizType: QuizTypes;
  isCorrect: boolean;
}) => {
  if (isCorrect) {
    await upgradeKnowledgeLevelCorrect({ userId, word, quizType });
  } else {
    await upgradeKnowledgeLevelFalse({ userId, word, quizType });
  }
};
const upgradeKnowledgeLevelCorrect = async ({
  userId,
  word,
  quizType,
}: {
  userId: string;
  word: string;
  quizType: QuizTypes;
}) => {
  const spacedRepetition = await SpacedRepetitionModel.findOne({
    userId,
    word,
  });
  if (!spacedRepetition) {
    await SpacedRepetitionModel.create({
      userId,
      word,
      knowledgeLevel: 2,
      nextAllowedUpgrade: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return;
  }

  if (spacedRepetition.knowledgeLevel >= 5) {
    return;
  }

  const now = new Date();
  if (spacedRepetition.nextAllowedUpgrade > now) {
    return;
  }

  switch (quizType) {
    case "multipleChoice":
      if (spacedRepetition.knowledgeLevel < 3) {
        spacedRepetition.knowledgeLevel += 1;
      }
      break;
    case "writeDefinition":
      if (spacedRepetition.knowledgeLevel < 3) {
        spacedRepetition.knowledgeLevel += 2;
      } else {
        spacedRepetition.knowledgeLevel += 1;
      }
      break;
    default:
      exhasutiveMatchingGuard(quizType);
      break;
  }
  const currentLevel = spacedRepetition.knowledgeLevel as 1 | 2 | 3 | 4 | 5;

  switch (currentLevel) {
    case 1:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 1 * 24 * 60 * 60 * 1000,
      );
      break;
    case 2:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 1 * 24 * 60 * 60 * 1000,
      );
      break;
    case 3:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 5 * 24 * 60 * 60 * 1000,
      );
      break;
    case 4:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000,
      );
      break;
    case 5:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      );
      break;
  }

  await spacedRepetition.save();
};
const upgradeKnowledgeLevelFalse = async ({
  userId,
  word,
  quizType,
}: {
  userId: string;
  word: string;
  quizType: QuizTypes;
}) => {
  const spacedRepetition = await SpacedRepetitionModel.findOne({
    userId,
    word,
  });
  if (!spacedRepetition) {
    await SpacedRepetitionModel.create({
      userId,
      word,
      knowledgeLevel: 1,
      nextAllowedUpgrade: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return;
  }

  if (spacedRepetition.knowledgeLevel === 1) {
    return;
  }

  const now = new Date();
  if (spacedRepetition.nextAllowedUpgrade > now) {
    return;
  }

  switch (quizType) {
    case "multipleChoice":
      if (spacedRepetition.knowledgeLevel > 1) {
        spacedRepetition.knowledgeLevel -= 1;
      }
      break;
    case "writeDefinition":
      if (spacedRepetition.knowledgeLevel > 3) {
        spacedRepetition.knowledgeLevel -= 2;
      } else {
        spacedRepetition.knowledgeLevel -= 1;
      }
      break;
    default:
      exhasutiveMatchingGuard(quizType);
      break;
  }
  const currentLevel = spacedRepetition.knowledgeLevel as 1 | 2 | 3 | 4 | 5;

  switch (currentLevel) {
    case 1:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 1 * 24 * 60 * 60 * 1000,
      );
      break;
    case 2:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 1 * 24 * 60 * 60 * 1000,
      );
      break;
    case 3:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 5 * 24 * 60 * 60 * 1000,
      );
      break;
    case 4:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000,
      );
      break;
    case 5:
      spacedRepetition.nextAllowedUpgrade = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      );
      break;
  }

  await spacedRepetition.save();
};

export const wordsByKnowledgeLevel = async (userId: string) => {
  const spacedRepetitions = await SpacedRepetitionModel.find({ userId });
  const wordsByLevel: Record<number, string[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
  spacedRepetitions.forEach((rep) => {
    wordsByLevel[rep.knowledgeLevel].push(rep.word);
  });
  return wordsByLevel;
};

// spacedRepetitionRouter.post("/", async (req, res) => {
//   const currentUser = (req as any).currentUser;
//   if (!currentUser) {
//     return res.json([]);
//   }
//   const zodValidator = z.object({
//     words: z.array(z.string()),
//   });
//   const validationResult = zodValidator.safeParse(req.body);
//   if (!validationResult.success) {
//     return res.status(400).json({ error: "Invalid request body" });
//   }
//   const { words } = validationResult.data;

//   const repetitions = await RepetitionModel.find({
//     userId: currentUser.userId,
//     word: { $in: words },
//   });
//   res.json(repetitions);
// });

export default spacedRepetitionRouter;
