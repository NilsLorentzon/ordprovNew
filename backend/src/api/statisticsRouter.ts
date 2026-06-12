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

  //sort by answeredTime
  // const correctlyAnsweredWords = await QuestionModel.find(
  //   {
  //     userId: currentUser.userId,
  //     isCorrect: true,
  //   },
  //   { word: 1, answeredTime: 1 },
  // )
  // .sort({ answeredTime: -1 })
  //   .distinct("word")
  //   .exec();

  const correctlyAnsweredWords = await QuestionModel.aggregate([
    {
      $match: {
        userId: currentUser.userId,
        isCorrect: true,
      },
    },
    {
      // Sort everything by newest first before grouping
      $sort: { answeredTime: -1 },
    },
    {
      // Group by the word to eliminate duplicates
      $group: {
        _id: "$word",
        // Since it's already sorted, $first grabs the latest time
        latestAnswered: { $first: "$answeredTime" },
      },
    },
    {
      // Sort the final unique groups by that latest time
      $sort: { latestAnswered: -1 },
    },
    {
      // Optional: Reshape the output to just give you an array of strings
      $project: {
        _id: 0,
        word: "$_id",
      },
    },
  ]);

  // Mapping it makes it a clean array of strings: ["apple", "banana", ...]
  const uniqueWordsList = correctlyAnsweredWords.map((item) => item.word);

  // select last 10 answers from QuestionModel based on answeredTime and return them in the response
  const latestAnswers = await QuestionModel.find({ userId: currentUser.userId })
    .sort({ answeredTime: -1 })
    .limit(100)
    .exec();

  const statisticsData = {
    amountOfCorrectlyAnsweredWords: uniqueWordsList.length,
    correctlyAnsweredWords: uniqueWordsList, //.map((q) => q.word),
    totalAmountOfWords: allWordsLength,
    last100: {
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
