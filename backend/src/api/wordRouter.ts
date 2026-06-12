import express, { NextFunction } from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import { authenticateToken } from "./loginRouter";
import { QuestionModel } from "../Models/QuestionModel";
import { WordModel } from "../Models/WordModel";
import { z } from "zod";
import { WordDataQuiz } from "./wikiRouter";

const wordRouter = express.Router();

wordRouter.get("/", async (req, res) => {
  // const currentUser = (req as any).currentUser;
  // if (!currentUser) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  const wordList = await WordModel.find(
    {},
    {
      word: 1,
      // "definitions.shortDefinition": 1,
      partsOfSpeech: 1,
    },
  );

  if (wordList.length === 0 || !wordList) {
    return res.status(404).json({ error: "No words found" });
  }
  return res.json(wordList);
});
// queryFn: (): Promise<WordDataQuiz[]> => axios.get(`word/prov?antal=${amountOfQuestions}&typ=${questionType}`),

wordRouter.get("/prov", async (req, res) => {
  const wordList = await WordModel.find({}).lean();
  if (wordList.length === 0 || !wordList) {
    return res.status(404).json({ error: "No words found" });
  }

  const validationSchema = z.object({
    antal: z.string().transform((val) => parseInt(val)),
    typ: z.enum(["multipleChoice", "writeDefinition"]),
  });
  const validationResult = validationSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }
  const { antal: amount, typ: quizType } = validationResult.data;

  const wordListQuiz: WordDataQuiz[] = wordList
    .map((word) => ({
      word: word.word,
      definitions: word.definitions,
      partsOfSpeech: word.partsOfSpeech,
      sentences: word.sentences,
      createdTime: word.createdTime,
      alternatives: [],
      generatedTime: new Date(),
    }))
    .sort(() => 0.5 - Math.random());

  const generatedTime = new Date();

  const selectedWords = wordListQuiz.slice(0, amount).map((word) => {
    const randomPartOfSpeech = word.partsOfSpeech[0];
    // word.partsOfSpeech[Math.floor(Math.random() * word.partsOfSpeech.length)];
    return {
      ...word,
      alternatives: [] as { word: string; definition: string }[],
      generatedTime: generatedTime,
      partOfSpeech: randomPartOfSpeech,
    };
  });
  const alternativeWords = wordListQuiz.slice(amount);
  const selectedDefinitions = selectedWords.map(
    (w) => w.definitions.shortDefinition,
  );
  const alternatives = alternativeWords
    .filter((w) => !selectedDefinitions.includes(w.definitions.shortDefinition))
    .sort(() => 0.5 - Math.random());

  const alternativesByPartOfSpeech: Record<string, WordDataQuiz[]> = {};
  alternatives.forEach((alternative) => {
    alternative.partsOfSpeech.forEach((partOfSpeech) => {
      if (!alternativesByPartOfSpeech[partOfSpeech]) {
        alternativesByPartOfSpeech[partOfSpeech] = [];
      } else {
        alternativesByPartOfSpeech[partOfSpeech].push(alternative);
      }
    });
  });

  for (let index = 0; index < selectedWords.length; index++) {
    const word = selectedWords[index];
    const partOfSpeech = word.partOfSpeech;
    const alternativesForPartOfSpeech =
      alternativesByPartOfSpeech[partOfSpeech] || [];

    const selectedAlternatives = alternativesForPartOfSpeech
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    word.alternatives = [
      { word: word.word, definition: word.definitions.shortDefinition },
      ...selectedAlternatives.map((a) => ({
        word: a.word,
        definition: a.definitions.shortDefinition,
      })),
    ].sort(() => 0.5 - Math.random());
    alternativesByPartOfSpeech[partOfSpeech] =
      alternativesForPartOfSpeech.filter(
        (a) => !selectedAlternatives.includes(a),
      );
  }

  res.json(selectedWords);
});

wordRouter.get("/:word", async (req, res) => {
  // const currentUser = (req as any).currentUser;
  // if (!currentUser) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  const zodValidation = z.string();
  const validationResult = zodValidation.safeParse(req.params.word);
  if (!validationResult.success) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }
  const wordList = await WordModel.findOne({
    word: validationResult.data,
  });
  if (!wordList) {
    return res.json(undefined);
  }

  res.json(wordList);
});

export default wordRouter;
