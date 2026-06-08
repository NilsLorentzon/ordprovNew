import express, { NextFunction } from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import { authenticateToken } from "./loginRouter";
import { QuestionModel } from "../Models/QuestionModel";
import { WordModel } from "../Models/WordModel";
import { ReportModel, ReportValidator } from "../Models/ReportModel";

const reportRouter = express.Router();
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
reportRouter.post("/", authenticateToken, async (req, res) => {
  const currentUser = (req as any).currentUser;
  // if (!currentUser) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  const userId = currentUser ? currentUser.userId : "anonymous";

  const validationResult = ReportValidator.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }
  const { title, content } = validationResult.data;

  const newReport = new ReportModel({
    userId,
    title,
    content,
  });
  await newReport.save();
  return res.status(201).json({ message: "Report submitted successfully" });
});

export default reportRouter;
