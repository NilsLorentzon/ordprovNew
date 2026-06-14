import express, { NextFunction } from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";

const saldoRouter = express.Router();

// example
// _1984..1	roman..1	dystopi..1	_1984..pm.1	1984	pm	pm_uwb_hemsöborna
// _1984..1	roman..1	dystopi..1	nittonhundraåttiofyra..pm.1	nittonhundraåttiofyra	pm	pm_uwb_hemsöborna
// _1984..1	roman..1	dystopi..1	Nittonhundraåttiofyra..pm.1	Nittonhundraåttiofyra	pm	pm_uwb_hemsöborna
// a..1	bokstav..1	PRIM..1	a..nn.1	a	nn	nn_vn_alfa_abc
// A..1	initial..1	PRIM..1	A..nn.1	A	nn	nn_vn_alfa_abc
saldoRouter.get("/", async (req, res) => {
  const saldoTabSeperatedData = fs.readFileSync(
    "words/saldo20v03.txt",
    "utf-8",
  );
  const saldoLines = saldoTabSeperatedData.split("\n");
  const saldoData = saldoLines.map((line) => {
    const [
      wordWithIndex,
      primaryFather,
      secondaryFather,
      lemma,
      word,
      partOfSpeech,
      conjugation,
    ] = line.split("\t");
    return {
      wordWithIndex,
      primaryFather,
      secondaryFather,
      lemma,
      word,
      partOfSpeech,
      conjugation,
    };
  }).filter((entry) => entry.primaryFather !== "förnamn..1" && entry.primaryFather !== "efternamn..1");
  fs.writeFileSync("words/saldo20v03.json", JSON.stringify(saldoData, null, 2));
  res.json(saldoData);
});

export default saldoRouter;
