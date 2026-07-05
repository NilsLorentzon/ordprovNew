import express from "express";
import { authenticateToken } from "./authenticationRouter";
import { QuestionModel } from "../Models/QuestionModel";
import { WordModel } from "../Models/WordModel";
import { SpacedRepetitionModel } from "../Models/SpacedRepetitionModel";

const statisticsRouter = express.Router();

statisticsRouter.get("/", async (req, res) => {
  const currentUser = (req as any).currentUser;
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const allWordsLength = await WordModel.countDocuments();
  const correctlyAnsweredWords = await QuestionModel.aggregate([
    {
      $match: {
        userId: currentUser.userId,
        isCorrect: true,
      },
    },
    {
      $sort: { answeredAt: -1 },
    },
    {
      $group: {
        _id: "$word",
        latestAnswered: { $first: "$answeredAt" },
      },
    },
    {
      $sort: { latestAnswered: -1 },
    },
    {
      $project: {
        _id: 0,
        word: "$_id",
      },
    },
  ]);

  const uniqueWordsList = correctlyAnsweredWords.map((item) => item.word);
  const latestAnswers = await QuestionModel.find({ userId: currentUser.userId })
    .sort({ answeredAt: -1 })
    // .limit(100)
    .exec();

  const knowledgeLevels = await SpacedRepetitionModel.find({
    userId: currentUser.userId,
  });
  const knowledgeLevelStatistics = {
    1: allWordsLength,
    2: knowledgeLevels.filter((k) => k.knowledgeLevel === 2).length,
    3: knowledgeLevels.filter((k) => k.knowledgeLevel === 3).length,
    4: knowledgeLevels.filter((k) => k.knowledgeLevel === 4).length,
    5: knowledgeLevels.filter((k) => k.knowledgeLevel === 5).length,
  };

  const statisticsData = {
    amountOfCorrectlyAnsweredWords: uniqueWordsList.length,
    correctlyAnsweredWords: uniqueWordsList, //.map((q) => q.word),
    totalAmountOfWords: allWordsLength,
    lastInfinity: {
      correctAnswers: latestAnswers.filter((q) => q.isCorrect).length,
      totalAnswers: latestAnswers.length,
      answeredQuestions: latestAnswers
        .map((q) => ({
          word: q.word,
          isCorrect: q.isCorrect,
          correctAnswer: q.correctAnswer,
          userAnswer: q.answer,
        }))
        .slice(0, 100),
    },
    knowledgeLevelStatistics,
  };
  res.json(statisticsData);
});

export default statisticsRouter;
