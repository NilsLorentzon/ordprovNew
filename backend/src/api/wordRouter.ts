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
    // {
    //   word: 1,
    //   "definitions.shortDefinition": 1,
    //   partsOfSpeech: 1,
    // },
  ).limit(500);

  if (wordList.length === 0 || !wordList) {
    return res.status(404).json({ error: "No words found" });
  }
  return res.json(wordList);
});
wordRouter.get("/prov", async (req, res) => {
  const wordList = await WordModel.find({}).lean();
  if (wordList.length === 0 || !wordList) {
    return res.status(404).json({ error: "No words found" });
  }
  const wordListQuiz: WordDataQuiz[] = wordList.map((word) => ({
    word: word.word,
    definitions: word.definitions,
    partsOfSpeech: word.partsOfSpeech,
    sentences: word.sentences,
    createdTime: word.createdTime,
    alternatives: [],
    generatedTime: new Date(),
  }));

  const generatedDataFile = fs.readFileSync(
    "words/generated/final.json",
    "utf-8",
  );
  const generatedData: Record<string, any> = JSON.parse(generatedDataFile);

  const generatedTime = new Date();
  // only include from generated data
  const randomWords = wordListQuiz
    .filter((w) => generatedData[w.word])
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
  // const randomWords = wordListQuiz.sort(() => 0.5 - Math.random()).slice(0, 10);
  // console.log("Randomly selected words for quiz:", randomWords.map((w) => w.word));
  const words = randomWords.map((w) => w.word);
  // console.log("Selected words for quiz:", words);
  const randomWordsWithRandomPartOfSpeech = randomWords.map((word) => {
    const randomPartOfSpeech =
      word.partsOfSpeech[Math.floor(Math.random() * word.partsOfSpeech.length)];
    return {
      ...word,
      alternatives: [] as { word: string; definition: string }[],
      generatedTime: generatedTime,
      partOfSpeech: randomPartOfSpeech,
    };
  });
  const alternatives = wordListQuiz
    .filter((w) => !words.includes(w.word))
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

  for (
    let index = 0;
    index < randomWordsWithRandomPartOfSpeech.length;
    index++
  ) {
    const word = randomWordsWithRandomPartOfSpeech[index];
    const partOfSpeech = word.partOfSpeech;
    // select and remove 3 random alternatives with the same part of speech
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
    // remove selected alternatives from the list to avoid reuse
    alternativesByPartOfSpeech[partOfSpeech] =
      alternativesForPartOfSpeech.filter(
        (a) => !selectedAlternatives.includes(a),
      );
  }

  res.json(randomWordsWithRandomPartOfSpeech);
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
    return res.status(404).json({ error: "Word not found" });
  }

  res.json(wordList);
});

export default wordRouter;
