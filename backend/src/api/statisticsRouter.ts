import express, { NextFunction } from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import { authenticateToken } from "./loginRouter";
import { QuestionModel } from "../Models/QuestionModel";
import { WordModel } from "../Models/WordModel";

const statisticsRouter = express.Router();
// interface Statistics {
//   last10: {
//     correctAnswers: number;
//     answeredQuestions: {
//       word: string;
//       correctAnswer: boolean;
//       userAnswer: string;
//     }[];
//   };
// }
statisticsRouter.get("/", authenticateToken, async (req, res) => {
  const currentUser = (req as any).currentUser;
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const allWordsLength = await WordModel.countDocuments();

  // find total count of all unique words that the user has answered correctly in QuestionModel
  const allCorrectlyAnswered = await QuestionModel.find(
    {
      userId: currentUser.userId,
      isCorrect: true,
    },
    {
      word: 1,
    },
  )
    .distinct("word")
    .exec();

  // select last 10 answers from QuestionModel based on answeredTime and return them in the response
  const latestAnswers = await QuestionModel.find({ userId: currentUser.userId })
    .sort({ answeredTime: -1 })
    .limit(10)
    .exec();

  const statisticsData = {
    totalCorrectlyAnsweredWords: allCorrectlyAnswered.length,
    totalWords: allWordsLength,
    last10: {
      correctAnswers: latestAnswers.filter((q) => q.isCorrect).length,
      totalAnswers: latestAnswers.length,
      answeredQuestions: latestAnswers.map((q) => ({
        word: q.word,
        isCorrect: q.isCorrect,
        correctAnswer: q.correctAnswer,
        userAnswer: q.answer,
      })),
    },
  };
  res.json(statisticsData);
});

export default statisticsRouter;
