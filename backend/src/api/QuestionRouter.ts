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

const questionRouter = express.Router();

questionRouter.post("/question", authenticateToken, (req, res) => {
  const zodValidation = z.object({
    userId: z.string(),
    word: z.string(),
    alternativeWords: z.array(z.string()),
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
  

  


});

export default questionRouter;
