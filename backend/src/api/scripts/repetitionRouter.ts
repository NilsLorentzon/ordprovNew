import express from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { UserModel } from "../../Models/UserModel";
import { z } from "zod";
import { QuestionModel } from "../../Models/QuestionModel";
import { RepetitionModel } from "../../Models/RepetitionModel";

const repetitionRouter = express.Router();

repetitionRouter.post("/word", async (req, res) => {
  const currentUser = (req as any).currentUser;
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const zodValidator = z.object({
    word: z.string(),
    isBookmarked: z.boolean(),
  });
  const validationResult = zodValidator.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { word, isBookmarked } = validationResult.data;

  const existingRepetition = await RepetitionModel.findOne({
    userId: currentUser.userId,
    word,
  });
  if (existingRepetition && isBookmarked === false) {
    await RepetitionModel.deleteOne({ _id: existingRepetition._id });
    return res.json({ message: "Word removed from repetitions" });
  }
  if (existingRepetition && isBookmarked === true) {
    return res.json({ message: "Word already in repetitions" });
  }
  const newRepetition = new RepetitionModel({
    userId: currentUser.userId,
    word,
  });
  await newRepetition.save();
  res.json({ message: "Word added to repetitions" });
});

repetitionRouter.post("/all", async (req, res) => {
  const currentUser = (req as any).currentUser;
  if (!currentUser) {
    return res.json([]);
  }
  // body has a list of words
  const repetitions = await RepetitionModel.find({
    userId: currentUser.userId,
  });
  res.json(repetitions);
});
repetitionRouter.post("/", async (req, res) => {
  const currentUser = (req as any).currentUser;
  if (!currentUser) {
    return res.json([]);
  }
  // body has a list of words
  const zodValidator = z.object({
    words: z.array(z.string()),
  });
  const validationResult = zodValidator.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { words } = validationResult.data;

  const repetitions = await RepetitionModel.find({
    userId: currentUser.userId,
    word: { $in: words },
  });
  res.json(repetitions);
});

export default repetitionRouter;
