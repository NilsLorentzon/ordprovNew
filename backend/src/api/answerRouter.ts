import express from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { UserModel } from "../Models/UserModel";
import { authenticateToken } from "./loginRouter";
import { z } from "zod";
import { QuestionModel } from "../Models/QuestionModel";
import { RepetitionModel } from "../Models/RepetitionModel";
import { upgradeKnowledgeLevel } from "./spacedRepetitionRouter";

const answerRouter = express.Router();

answerRouter.post("/", authenticateToken, async (req, res) => {
  const zodValidation = z.object({
    // userId: z.string(),
    word: z.string(),
    alternativeWords: z.array(
      z.object({
        word: z.string(),
        definition: z.string(),
      }),
    ),
    correctAnswer: z.string(),
    answer: z.string(),
    isCorrect: z.boolean(),
    generatedTime: z.coerce.date(),
    answeredTime: z.coerce.date(),
  });
  const validationResult = zodValidation.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  // console.log("Received question data:", req.currentUser);
  const questionData = validationResult.data;
  const userId = (req as any).currentUser.userId;
  (questionData as any).userId = userId;
  const questionDocument = new QuestionModel(questionData);
  await questionDocument.save();

  await upgradeKnowledgeLevel({
    userId: questionDocument.userId,
    word: questionDocument.word,
    quizType: "multipleChoice",
    isCorrect: true,
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

export default answerRouter;
