import express from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { authenticateToken } from "./loginRouter";
import { Word, WordModel } from "../Models/WordModel";
const wikiRouter = express.Router();

// const wordClassesEnglishToSwedish = {
//   noun: "substantiv",
//   adjective: "adjektiv",
//   verb: "verb",
//   adverb: "adverb",
//   pronoun: "pronomen",
//   numeral: "räkneord",
//   preposition: "preposition",
//   conjunction: "konjunktion",
//   subordinatingConjunction: "subjunktion",
//   interjection: "interjektion",
// };
const wordClassesSwedishToEnglish = {
  substantiv: "noun",
  adjektiv: "adjective",
  verb: "verb",
  adverb: "adverb",
  pronomen: "pronoun",
  räkneord: "numeral",
  preposition: "preposition",
  konjunktion: "conjunction",
  subjunktion: "subordinating conjunction",
  interjektion: "interjection",
};

const swedishWordclassList = Object.keys(wordClassesSwedishToEnglish);

interface WordAppended {
  word: string;
  partOfSpeech: string;
  forms: {
    word: string;
    formTags: string[];
  }[];
}
wikiRouter.get("/free-dictionary-append", async (req, res) => {
  const file = fs.readFileSync("words/allWordsFiltered.json", "utf-8");
  const existingWordsHashmap: Record<string, string> = JSON.parse(file);
  const wordList = Object.keys(existingWordsHashmap);
  const appendedWordHashmap: Record<string, WordAppended[]> = {};
  for (let index = 0; index < 10; index++) {
    const currentWord = wordList[index];
    const url = `https://freedictionaryapi.com/api/v1/entries/sv/${currentWord}`;
    try {
      const response = await axios.get(url);
      const wordData: {
        word: string;
        entries: {
          language: {
            code: string;
            name: string;
          };
          partOfSpeech: string;
          forms: {
            word: string;
            tags: string[];
          }[];
        }[];
      } = response.data;
      // if an entrie has the same part of speech as an already existing entrie, we skip it
      const uniqueEntries: WordAppended[] = [];
      for (const entry of wordData.entries) {
        if (
          entry.language.code !== "sv" ||
          uniqueEntries.find((e) => e.partOfSpeech === entry.partOfSpeech)
        ) {
          continue;
        }
        uniqueEntries.push({
          word: wordData.word,
          partOfSpeech: entry.partOfSpeech,
          forms: entry.forms.map((form) => ({
            word: form.word,
            formTags: form.tags,
          })),
        });
      }
      appendedWordHashmap[currentWord] = uniqueEntries;
      console.log(
        `Appended data for word: ${currentWord}`,
        uniqueEntries.length,
      );
    } catch (error) {
      fs.writeFileSync(
        `words/allWordsPartOfSpeechAppended.json`,
        JSON.stringify(appendedWordHashmap, null, 2),
      );
      console.error("Error fetching data:", error);
    }
  }
  fs.writeFileSync(
    `words/allWordsPartOfSpeechAppended.json`,
    JSON.stringify(appendedWordHashmap, null, 2),
  );
});

// aria-labelledby="Svenska"
const semanticRelationAttributeToHtmlClass = {
  compoundWords: "template-sammansättningar",
  relatedWords: "template-besläktade_ord",
  troponyms: "template-troponymer",
  synonyms: "template-synonymer",
  phrases: "template-fraser",
  comparatives: "template-jämför",
  constructions: "template-konstr",
  seeAlso: "template-seäven",
  etymology: "template-etymologi",
  antonyms: "template-antonymer",
  seeAlsoBring: "template-seäven-bring",
};

interface WiktionaryData {
  word: string;
  isError: boolean;
  partsOfSpeech: {
    partOfSpeech: string;
    conjugationsTable: {
      text: string;
      isHeader: boolean;
    }[];
    definitions: {
      definition: string;
      semanticRelations: {
        compoundWords?: string[];
        relatedWords?: string[];
        troponyms?: string[];
        synonyms?: string[];
        phrases?: string[];
        comparatives?: string[];
        constructions?: string[];
        seeAlso?: string[];
        etymology?: string[];
        antonyms?: string[];
        seeAlsoBring?: string[];
      };
    }[];
    frequency: number;
  }[];
}

const getWordWiktionaryData = async (word: string) => {
  const url = `https://sv.wiktionary.org/wiki/${word}`;
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "NilsWordStudyScraper/1.0 (nils.lorentzon@hotmail.com)",
      "Api-User-Agent": "NilsWordStudyScraper/1.0 (nils.lorentzon@hotmail.com)",
    },
  });
  const $ = cheerio.load(data);

  const swedishSection = $('[aria-labelledby="Svenska"]');
  const potentialPartsOfSpeech = swedishSection.children("[aria-labelledby]");
  const partsOfSpeech = potentialPartsOfSpeech
    .filter((i, el) => {
      const partOfSpeech = $(el).attr("aria-labelledby");
      return swedishWordclassList.includes(partOfSpeech?.toLowerCase() || "");
    })
    .map((i, el) => {
      const partOfSpeech = $(el).attr("aria-labelledby") || "";
      console.log("Found part of speech:", partOfSpeech);
      return { partOfSpeechObject: el, partOfSpeech: partOfSpeech };
    });
  const wordData: WiktionaryData = {
    word: word,
    isError: false,
    partsOfSpeech: partsOfSpeech
      .map((i, value) => {
        const firstList = $(value.partOfSpeechObject).find("ol").first();
        // get the first table with class "grammar" and convert it into a list of lists with headers and items
        const table = $(value.partOfSpeechObject).find("table.grammar").first();
        const conjugationsTable: {
          text: string;
          isHeader: boolean;
        }[] = [];
        if (table.length > 0) {
          table.find("tr").each((k, tr) => {
            const $tr = $(tr);
            $tr.find("th, td").each((l, cell) => {
              const $cell = $(cell);
              conjugationsTable.push({
                text: $cell.text().trim(),
                isHeader: $cell.is("th"),
              });
            });
          });
        }
        const definitions = firstList
          .children("li")
          .map((j, li) => {
            const $li = $(li);
            const cleanItem = $li.clone();
            cleanItem.find("ul, dl, div, table").remove();

            const semanticRelations: {
              compoundWords?: string[];
              relatedWords?: string[];
              troponyms?: string[];
              synonyms?: string[];
              phrases?: string[];
              comparatives?: string[];
              constructions?: string[];
              seeAlso?: string[];
              etymology?: string[];
              antonyms?: string[];
              seeAlsoBring?: string[];
            } = {};
            const semanticRelationsDl = $li.find("dl").first();
            const semanticRelationElements =
              semanticRelationsDl.children(".semantic-relation");
            semanticRelationElements.each((k, relation) => {
              const $relation = $(relation);
              Object.keys(semanticRelationAttributeToHtmlClass).forEach(
                (key) => {
                  if (
                    $relation.hasClass(
                      semanticRelationAttributeToHtmlClass[key],
                    )
                  ) {
                    const rawText = $relation.text();
                    const extractedWords = rawText
                      .substring(rawText.indexOf(":") + 1)
                      .split(",")
                      .map((w) => w.trim());
                    if (
                      !semanticRelations[key as keyof typeof semanticRelations]
                    ) {
                      semanticRelations[key as keyof typeof semanticRelations] =
                        [];
                    }
                    semanticRelations[
                      key as keyof typeof semanticRelations
                    ]!.push(...extractedWords);
                  }
                },
              );
            });
            return {
              definition: cleanItem.text().trim(),
              semanticRelations,
            };
          })
          .get();
        return {
          partOfSpeech: value.partOfSpeech,
          conjugationsTable,
          definitions: definitions,
          frequency: 0,
        };
      })
      .get(),
  };
  return wordData;
};

wikiRouter.get("/wiktionary/word/:word", async (req, res) => {
  const file = fs.readFileSync("words/allWordsFiltered.json", "utf-8");
  const existingWordsHashmap: Record<string, string> = JSON.parse(file);
  const wordList = Object.keys(existingWordsHashmap);
  const appendedWordHashmap: Record<string, WordAppended[]> = {};
  const currentWord = req.params.word;
  const taco = await getWordWiktionaryData(currentWord);
  try {
    return res.json(taco);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.json({ error: "Error fetching data" });
  }
});

wikiRouter.get("/wiktionary/all-words-generate", async (req, res) => {
  const file = fs.readFileSync("words/allWordsFiltered.json", "utf-8");
  const existingWordsHashmap: Record<string, string> = JSON.parse(file);
  const wordList = Object.keys(existingWordsHashmap);
  let appendedWordHashmap: Record<string, WiktionaryData> = {};

  for (let index = 0; index < wordList.length; index++) {
    const word = wordList[index];
    // const newFile = `words/wiktionaryData/${element}.json`;
    let wordData: WiktionaryData = {
      word: word,
      isError: true,
      partsOfSpeech: [],
    };
    try {
      wordData = await getWordWiktionaryData(word);
      appendedWordHashmap[word] = wordData;
    } catch (error) {
      appendedWordHashmap[word] = wordData;
      console.error(`Error fetching data for word ${word}:`);
      console.error(`Error fetching data for word ${word}:`);
      console.error(`Error fetching data for word ${word}:`);
      // if error is a 429 error, we stop entire process
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        console.error("Received 429 Too Many Requests. Stopping the process.");
        break;
      }
    }
    if ((index % 10000 === 0 || index === wordList.length - 1) && index !== 0) {
      fs.writeFileSync(
        `words/wiktionaryData/words${index}.json`,
        JSON.stringify(appendedWordHashmap),
      );
      console.log(`Saved progress at index ${index} with word ${word}`);
      appendedWordHashmap = {};
    }
    console.log(`index ${index} with word ${word}`);
    // only make request every 100 ms
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  try {
    return res.json({ success: true });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.json({ error: "Error fetching data" });
  }
});

const speachBankPartOfSpeechToLetterCode = {
  substantiv: "nn",
  verb: "vb",
  adjektiv: "av",
  adverb: "jj",
};
wikiRouter.get("/single-word-frequency", async (req, res) => {
  const allCorpusFiles = fs.readFileSync("words/corpora.json", "utf-8");
  const corpusRaw: string[] = JSON.parse(allCorpusFiles);
  console.log("Number of corpora:", corpusRaw.length);
  const corpusUrlString = corpusRaw.join(",");
  console.log("Corpus URL string length:", corpusUrlString.length);
  const url = `https://ws.spraakbanken.gu.se/ws/korp/v8/lemgram_count?lemgram=abnorm..av.1`;
  // const url = `https://ws.spraakbanken.gu.se/ws/korp/v8/lemgram_count?lemgram=absolut..ab.1&corpus=${corpusUrlString}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "NilsWordStudyScraper/1.0 (https://github.com/NilsWordStudyScraper)",
      },
    });
    return res.json(response.data);
  } catch (error) {
    // console.error("Error fetching data:", error);
    return res.json({ error: "Error fetching data" });
  }
});

wikiRouter.get(
  "/wiktionary/filter-data-and-generate-statistics",
  async (req, res) => {
    const allFiles = fs.readdirSync("words/wiktionaryData");
    const allData: Record<string, WiktionaryData> = {};
    const missingWords: Record<string, string> = {};
    const removedForNotHavingDesiredPartOfSpeech: Record<string, string> = {};
    allFiles.forEach((file) => {
      const fileData = fs.readFileSync(`words/wiktionaryData/${file}`, "utf-8");
      const jsonData: Record<string, WiktionaryData> = JSON.parse(fileData);
      Object.keys(jsonData).forEach((word) => {
        if (jsonData[word].isError) {
          missingWords[word] = word;
          return;
        }
        const filteredPartsOfSpeech = jsonData[word].partsOfSpeech.filter(
          (pos) => {
            // remove all parts of speech that are not noun, verb, adjective or adverb
            const hasDesiredPartOfSpeech =
              pos.partOfSpeech.toLowerCase() === "substantiv" ||
              pos.partOfSpeech.toLowerCase() === "verb" ||
              pos.partOfSpeech.toLowerCase() === "adjektiv" ||
              pos.partOfSpeech.toLowerCase() === "adverb";
            return hasDesiredPartOfSpeech;
          },
        );

        if (filteredPartsOfSpeech.length === 0) {
          removedForNotHavingDesiredPartOfSpeech[word] = word;
          return;
        }
        jsonData[word].partsOfSpeech = filteredPartsOfSpeech;
        allData[word] = jsonData[word];
      });
    });
    const statistics = {
      totalWords: Object.keys(allData).length,
      missingWords: Object.keys(missingWords).length,
      removedForNotHavingDesiredPartOfSpeech: Object.keys(
        removedForNotHavingDesiredPartOfSpeech,
      ).length,
      missingWordsObject: missingWords,
      removedForNotHavingDesiredPartOfSpeechObject:
        removedForNotHavingDesiredPartOfSpeech,
    };
    fs.writeFileSync(
      "words/wiktionaryCleaned/statistics.json",
      JSON.stringify(statistics),
    );
    fs.writeFileSync(
      "words/wiktionaryCleaned/filteredData.json",
      JSON.stringify(allData),
    );
    return res.json(statistics);
  },
);
wikiRouter.get(
  "/wiktionary/add-frequency-data-to-existing-filtered-data-legacy",
  async (req, res) => {
    const filteredDataFile = fs.readFileSync(
      "words/wiktionaryCleaned/filteredData.json",
      "utf-8",
    );
    const filteredData: Record<string, WiktionaryData> =
      JSON.parse(filteredDataFile);
    const filteredDataKeys = Object.keys(filteredData);
    const existingFrequencyDataFile = fs.readFileSync(
      "words/wiktionaryCleaned/filteredDataWithFrequencyAll.json",
      "utf-8",
    );
    const existingFrequencyData: Record<string, WiktionaryData> = JSON.parse(
      existingFrequencyDataFile,
    );
    for (let index = 0; index < filteredDataKeys.length; index++) {
      const word = filteredDataKeys[index];
      const partsOfSpeech = filteredData[word].partsOfSpeech;
      // console.log("word:", word);
      // console.log(existingFrequencyData[word]);
      if (existingFrequencyData[word]) {
        filteredData[word] = existingFrequencyData[word];
        console.log(
          `index ${index} Skipped word ${word} because it already has frequency data`,
        );
        continue;
      }
      for (let index2 = 0; index2 < partsOfSpeech.length; index2++) {
        const pos = partsOfSpeech[index2];
        const partOfSpeechCode =
          speachBankPartOfSpeechToLetterCode[
            pos.partOfSpeech.toLowerCase() as keyof typeof speachBankPartOfSpeechToLetterCode
          ];
        const lemma = `${word}..${partOfSpeechCode}.1`;
        const url = `https://ws.spraakbanken.gu.se/ws/korp/v8/lemgram_count?lemgram=${lemma}`;
        try {
          const response = await axios.get(url, {
            headers: {
              "User-Agent":
                "NilsWordStudyScraper/1.0 (nils.lorentzon@hotmail.com)",
            },
          });

          // response object {
          // "ge..vb.1": 21752093,
          // "time": 0.07574629783630371
          // }
          // if response is 429 abort entire process
          const status = response.status;
          if (status === 429) {
            console.error(
              "Received 429 Too Many Requests. Stopping the process.",
            );
            return res.json({ error: "Received 429 Too Many Requests" });
          }
          const frequencyData = response.data;
          const frequency = frequencyData[lemma] || 0;
          filteredData[word].partsOfSpeech[index2].frequency = frequency;
          console.log(
            `index ${index} Added frequency data for word ${word} with part of speech ${pos.partOfSpeech}: ${frequency}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          // fs.writeFileSync(
          //   "words/wiktionaryCleaned/filteredDataWithFrequency.json",
          //   JSON.stringify(filteredData),
          // );
          // console.error("Error fetching data:", error);
        }
      }
      // if (
      //   (index % 10000 === 0 || index === filteredDataKeys.length - 1) &&
      //   index !== 0
      // ) {
      //   fs.writeFileSync(
      //     `words/wiktionaryCleaned/filteredDataWithFrequency${index}.json`,
      //     JSON.stringify(filteredData),
      //   );
      // }
    }
    fs.writeFileSync(
      `words/wiktionaryCleaned/filteredDataWithFrequencyNew.json`,
      JSON.stringify(filteredData),
    );
    return res.json({ success: true });
  },
);
wikiRouter.get(
  "/wiktionary/add-frequency-data-to-existing-filtered-data-legacy-fix",
  async (req, res) => {
    // const filteredDataFile = fs.readFileSync(
    //   "words/wiktionaryCleaned/filteredData.json",
    //   "utf-8",
    // );
    // const filteredData: Record<string, WiktionaryData> =
    //   JSON.parse(filteredDataFile);
    // const filteredDataKeys = Object.keys(filteredData);
    const existingFrequencyDataFile = fs.readFileSync(
      "words/wiktionaryCleaned/filteredDataWithFrequencyNewFixed.json",
      "utf-8",
    );
    const existingFrequencyData: Record<string, WiktionaryData> = JSON.parse(
      existingFrequencyDataFile,
    );
    const filteredDataKeys = Object.keys(existingFrequencyData);
    for (let index = 0; index < filteredDataKeys.length; index++) {
      const word = filteredDataKeys[index];
      const partsOfSpeech = existingFrequencyData[word].partsOfSpeech;

      for (let index2 = 0; index2 < partsOfSpeech.length; index2++) {
        const pos = partsOfSpeech[index2];
        if (pos.frequency > 0) {
          console.log(
            `index ${index} Skipped word ${word} with part of speech ${pos.partOfSpeech} because it already has frequency data or is a noun or verb`,
          );
          continue;
        }
        const partOfSpeechCode =
          speachBankPartOfSpeechToLetterCode[
            pos.partOfSpeech.toLowerCase() as keyof typeof speachBankPartOfSpeechToLetterCode
          ];
        const lemma = `${word}..${partOfSpeechCode}.1`;
        const url = `https://ws.spraakbanken.gu.se/ws/korp/v8/lemgram_count?lemgram=${lemma}`;
        try {
          const response = await axios.get(url, {
            headers: {
              "User-Agent":
                "NilsWordStudyScraper/1.0 (nils.lorentzon@hotmail.com)",
            },
          });

          // response object {
          // "ge..vb.1": 21752093,
          // "time": 0.07574629783630371
          // }
          // if response is 429 abort entire process
          const status = response.status;
          if (status === 429) {
            console.error(
              "Received 429 Too Many Requests. Stopping the process.",
            );
            return res.json({ error: "Received 429 Too Many Requests" });
          }
          const frequencyData = response.data;
          // tried to get first key of frequencyData that isnt time
          // const frequency = frequencyData[lemma] || 0;
          let frequency = 0;
          for (const key in frequencyData) {
            if (key !== "time") {
              frequency = frequencyData[key];
              break;
            }
          }
          existingFrequencyData[word].partsOfSpeech[index2].frequency =
            frequency;
          console.log(
            `index ${index} Added frequency data for word ${word} with part of speech ${pos.partOfSpeech}: ${frequency}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          // fs.writeFileSync(
          //   "words/wiktionaryCleaned/filteredDataWithFrequency.json",
          //   JSON.stringify(filteredData),
          // );
          // console.error("Error fetching data:", error);
        }
      }
      // if (
      //   (index % 10000 === 0 || index === filteredDataKeys.length - 1) &&
      //   index !== 0
      // ) {
      //   fs.writeFileSync(
      //     `words/wiktionaryCleaned/filteredDataWithFrequency${index}.json`,
      //     JSON.stringify(filteredData),
      //   );
      // }
    }
    fs.writeFileSync(
      `words/wiktionaryCleaned/filteredDataWithFrequencyNewFixedFixed.json`,
      JSON.stringify(existingFrequencyData),
    );
    return res.json({ success: true });
  },
);
wikiRouter.get("/hp-word-analysis", async (req, res) => {
  const filteredDataWithFrequencyFile = fs.readFileSync(
    "words/wiktionaryCleaned/filteredDataWithFrequencyNew.json",
    "utf-8",
  );
  const filteredDataWithFrequency: Record<string, WiktionaryData> = JSON.parse(
    filteredDataWithFrequencyFile,
  );
  // const wordList = Object.keys(filteredDataWithFrequency);
  const hpWordFile = fs.readFileSync("words/hpWords.json", "utf-8");
  const hpWords: {
    word: string;
    definition: string;
  }[] = JSON.parse(hpWordFile);
  // check that there is a single word and not a sentance
  const hpWordsSingleWord = hpWords.filter((hp) => !hp.word.includes(" "));

  const hpWordsInFilteredData = hpWordsSingleWord.filter(
    (hp) => filteredDataWithFrequency[hp.word] !== undefined,
  );

  const missingWords = hpWordsSingleWord
    .filter((hp) => filteredDataWithFrequency[hp.word] === undefined)
    .map((hp) => hp.word)
    //sort by first two letters
    .sort((a, b) => a.localeCompare(b))
    .map((word) => ({ word, potentialMatch: null as string | null }));
  fs.writeFileSync(
    "words/hpWordsMissingInFilteredData.json",
    JSON.stringify(missingWords, null, 2),
  );
  console.log("Total HP words:", hpWords.length);

  fs.writeFileSync(
    "words/hpWordsInFilteredData.json",
    JSON.stringify(hpWordsInFilteredData, null, 2),
  );
  const statistics = {
    totalHpWords: hpWords.length,
    totalHpWordsSingleWord: hpWordsSingleWord.length,
    hpWordsInFilteredData: hpWordsInFilteredData.length,
    missingWords: missingWords,
  };
  return res.json({ statistics });
});

wikiRouter.get("/frekvenser-sorterat", async (req, res) => {
  const filteredDataWithFrequencyFile = fs.readFileSync(
    "words/wiktionaryCleaned/filteredDataWithFrequencyNewFixed.json",
    "utf-8",
  );
  const filteredDataWithFrequency: Record<string, WiktionaryData> = JSON.parse(
    filteredDataWithFrequencyFile,
  );
  const wordList = Object.keys(filteredDataWithFrequency);
  const wordFrequencyList = wordList
    .map((word) => {
      const totalFrequency = filteredDataWithFrequency[
        word
      ].partsOfSpeech.reduce((sum, pos) => sum + pos.frequency, 0);
      return { word, frequency: totalFrequency || 0 };
    })
    .filter(
      (wordData) =>
        wordData.frequency !== null && wordData.frequency !== undefined,
    )
    .sort((a, b) => b.frequency - a.frequency);

  const hpWordFile = fs.readFileSync(
    "words/hpWordsInFilteredData.json",
    "utf-8",
  );
  const hpWordsInFilteredData: {
    word: string;
    definition: string;
  }[] = JSON.parse(hpWordFile);
  const hpWordsSet = new Set(hpWordsInFilteredData.map((hp) => hp.word));
  // convert hpWordsSet to list
  const hpWordsAddedFrequency = Array.from(hpWordsSet)
    .map((word) => {
      return {
        word,
        frequency:
          filteredDataWithFrequency[word]?.partsOfSpeech.reduce(
            (sum, pos) => sum + pos.frequency,
            0,
          ) || 0,
      };
    })
    .sort((a, b) => b.frequency - a.frequency);
  // return res.json({ wordFrequencyList });
  return res.json({ hpWordsAddedFrequency });
});

interface WordData {
  word: string;
  wordList: {
    listName: string;
    category: string;
  }[];
  partsOfSpeech: {
    partOfSpeech: string;
    conjugationsList: string[];
    definitions: {
      shortDefinition: string;
      definition: string;
      longDefinition: string;
    }[];
  }[];
}
export interface WordDataQuiz extends Word {
  // word: string;
  // definitions: {
  //   shortDefinition: string;
  //   definition: string;
  //   longDefinition: string;
  // };
  // partsOfSpeech: string[];
  // sentences: string[];
  alternatives: { word: string; definition: string }[];
  generatedTime: Date;
}

// const wordDataZodValidator = z.object({
//   word: z.string(),
//   wordList: z.array(
//     z.object({
//       listName: z.string(),
//       category: z.string(),
//     }),
//   ),
//   partsOfSpeech: z.array(
//     z.object({
//       partOfSpeech: z.string(),
//       conjugationsList: z.array(z.string()),
//       definitions: z.array(
//         z.object({
//           shortDefinition: z.string(),
//           definition: z.string(),
//           longDefinition: z.string(),
//         }),
//       ),
//     }),
//   ),
// });

wikiRouter.get("/amount-of-definitions", async (req, res) => {
  const filteredDataWithFrequencyFile = fs.readFileSync(
    "words/wiktionaryCleaned/filteredDataWithFrequencyNewFixedFixed.json",
    "utf-8",
  );
  const filteredDataWithFrequency: Record<string, WiktionaryData> = JSON.parse(
    filteredDataWithFrequencyFile,
  );
  const wordList = Object.keys(filteredDataWithFrequency);
  const wordDataList: any[] = wordList.map((word) => {
    const wordData = filteredDataWithFrequency[word];
    const totalDefinitions = wordData.partsOfSpeech.reduce(
      (sum, pos) => sum + pos.definitions.length,
      0,
    );
    return `Word: ${word}, Total Definitions: ${totalDefinitions}`;
  });
  return res.json({ wordDataList });
});

const generateWordDataStructureOnDataset = () => {
  const allDataFile = fs.readFileSync(
    "words/wiktionaryCleaned/filteredDataWithFrequencyNewFixedFixed.json",
    "utf-8",
  );
  const allData: Record<string, WiktionaryData> = JSON.parse(allDataFile);

  // hp dataset specific code
  const fileLocation = "words/hpWordsInFilteredData.json";
  const fileData = fs.readFileSync(fileLocation, "utf-8");
  const nonUniquehpWords: {
    word: string;
    definition: string;
    page: number;
  }[] = JSON.parse(fileData);
  // remove duplicates based on word
  const uniqueHpWordsMap: Record<
    string,
    { word: string; definition: string; page: number }
  > = {};
  nonUniquehpWords.forEach((hp) => {
    if (!uniqueHpWordsMap[hp.word]) {
      uniqueHpWordsMap[hp.word] = hp;
    }
  });
  const hpWords = Object.values(uniqueHpWordsMap);

  const generateCategoryNameFromPage = (page: number) => {
    if (page < 35) {
      const year = 1976 + page;
      return `${year}`;
    } else {
      // two tests per year ht and vt
      const isEven = (page - 35) % 2 === 0;
      const additionalYears = Math.floor((page - 35) / 2);
      const year = 2011 + additionalYears;
      const semester = isEven ? "VT" : "HT";
      return `${year}-${semester}`;
    }
  };

  const wordDataList: WordData[] = hpWords.map((hp) => {
    const dataFromAllData = allData[hp.word];
    return {
      word: hp.word,
      wordList: [
        {
          listName: "HP Words",
          category: generateCategoryNameFromPage(hp.page),
        },
      ],
      partsOfSpeech: dataFromAllData.partsOfSpeech
        // .filter((pos) => {
        //   const hasDesiredPartOfSpeech =
        //     pos.partOfSpeech.toLowerCase() === "substantiv" ||
        //     pos.partOfSpeech.toLowerCase() === "verb" ||
        //     pos.partOfSpeech.toLowerCase() === "adjektiv" ||
        //     pos.partOfSpeech.toLowerCase() === "adverb";
        //   return hasDesiredPartOfSpeech;
        // })
        .map((pos) => ({
          partOfSpeech: pos.partOfSpeech.toLowerCase(),
          conjugationsList: pos.conjugationsTable
            // remove if same as word or already in list
            .filter((c) => !c.isHeader && c.text.trim() !== "")
            .filter((c) => c.text.trim() !== hp.word)
            .filter(
              (c, index, self) =>
                index ===
                self.findIndex((t) => t.text.trim() === c.text.trim()),
            )
            .map((c) => c.text),
          definitions: pos.definitions.map((d) => ({
            shortDefinition: hp.definition,
            wikiDefinition: d.definition,
            definition: "",
            longDefinition: "",
          })),
        })),
    };
  });

  fs.writeFileSync("words/final.json", JSON.stringify(wordDataList));
  return wordDataList;
};

wikiRouter.get(
  "/word-list",
  // authenticateToken,
  async (req, res) => {
    const wordDataList = generateWordDataStructureOnDataset();
    const words = wordDataList.map((w) => ({
      word: w.word,
      partsOfSpeech: w.partsOfSpeech.map((pos) => pos.partOfSpeech),
      definition:
        "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    }));

    res.json(words);
  },
);

wikiRouter.get(
  "/save-to-db",
  // authenticateToken,
  async (req, res) => {
    const wordDataList = generateWordDataStructureOnDataset();
    const generatedDataFile = fs.readFileSync(
      "words/generated/final.json",
      "utf-8",
    );
    const generatedData: Record<string, GenerateRequestBody> =
      JSON.parse(generatedDataFile);
    const createdTime = new Date();

    const wordsExtended: Word[] = wordDataList.map((wordData) => {
      if (generatedData[wordData.word]) {
        return {
          word: wordData.word,
          definitions: {
            shortDefinition:
              wordData.partsOfSpeech[0].definitions[0].shortDefinition,
            definition: generatedData[wordData.word].definition,
            longDefinition: generatedData[wordData.word].definition,
          },
          sentences: generatedData[wordData.word].sentences,
          partsOfSpeech: wordData.partsOfSpeech.map((pos) => pos.partOfSpeech),
          createdTime: createdTime,
        };
      } else {
        return {
          word: wordData.word,
          definitions: {
            shortDefinition:
              wordData.partsOfSpeech[0].definitions[0].shortDefinition,
            definition:
              "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
            longDefinition: "",
          },
          sentences: [
            "Svampen absorberar vatten extremt snabbt och effektivt.",
            "Han absorberade all information under föreläsningen med ett djupt intresse.",
            "Mörka kläder tenderar att absorbera solljus och blir därför snabbt varma.",
            "Ljudet absorberas effektivt av de nya akustikplattorna i kontorslandskapet.",
            "Barnet var helt absorberat av sitt datorspel och reagerade inte när vi ropade.",
            "Gifterna hade tyvärr redan absorberats av kroppen innan motgiftet hann ges.",
            "Hushållspapperet har en mycket bra absorberande förmåga vid spill.",
            "All min uppmärksamhet absorberades av den fängslande och spännande boken.",
            "Det stora moderbolaget har nyligen absorberat den mindre konkurrenten på marknaden.",
            "Växter absorberar koldioxid ur luften som en viktig del i fotosyntesen.",
          ],
          partsOfSpeech: wordData.partsOfSpeech.map((pos) => pos.partOfSpeech),
          createdTime: createdTime,
        };
      }
    });

    // skip duplicate keys instead of crashing entire process and continue inserting the rest of the words
    // await WordModel.insertMany(wordsExtended)
    await WordModel.create(wordsExtended).catch((error) => {
      if (error.code === 11000) {
        console.warn(
          "Duplicate key error occurred. Skipping duplicate entry and continuing with the rest.",
        );
      } else {
        console.error("Error inserting words into database:", error);
      }
    });

    return res.json(wordsExtended);
  },
);

wikiRouter.get(
  "/generate-WordData-structure-on-dataset",
  // authenticateToken,
  async (req, res) => {
    const wordDataList = generateWordDataStructureOnDataset();
    const generatedDataFile = fs.readFileSync(
      "words/generated/generatedWords.json",
      "utf-8",
    );
    const generatedData: Record<string, GenerateRequestBody> =
      JSON.parse(generatedDataFile);

    const wordsExtended: WordDataQuiz[] = wordDataList.map((wordData) => {
      if (generatedData[wordData.word]) {
        return {
          word: wordData.word,
          createdTime: new Date(),
          definitions: {
            shortDefinition:
              wordData.partsOfSpeech[0].definitions[0].shortDefinition,
            definition: generatedData[wordData.word].definition,
            longDefinition: generatedData[wordData.word].definition,
          },
          sentences: generatedData[wordData.word].sentences,
          partsOfSpeech: wordData.partsOfSpeech.map((pos) => pos.partOfSpeech),
          alternatives: [],
          generatedTime: new Date(),
        };
      } else {
        return {
          word: wordData.word,
          createdTime: new Date(),
          definitions: {
            shortDefinition:
              wordData.partsOfSpeech[0].definitions[0].shortDefinition,
            definition: "",
            longDefinition: "",
          },
          sentences: [],
          partsOfSpeech: wordData.partsOfSpeech.map((pos) => pos.partOfSpeech),
          alternatives: [],
          generatedTime: new Date(),
        };
      }
    });
    const wordsWithAI = wordsExtended.filter(
      (w) => w.definitions.definition !== "" && w.sentences.length > 0,
    );

    const randomWords = wordsWithAI
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    const words = randomWords.map((w) => w.word);
    const randomWordsWithRandomPartOfSpeech = randomWords.map((word) => {
      const randomPartOfSpeech =
        word.partsOfSpeech[
          Math.floor(Math.random() * word.partsOfSpeech.length)
        ];
      return {
        ...word,
        partOfSpeech: randomPartOfSpeech,
      };
    });
    const alternatives = wordsExtended
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
        .slice(0, 3);
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

    return res.json(randomWordsWithRandomPartOfSpeech);
  },
);

const ai = new GoogleGenAI({});

async function generateText() {
  try {
    // Call the model (gemini-3.5-flash is ideal for fast, general text tasks)
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Svara på strikt html format så att inga modificationer 
        på ditt svar måste göras för att en browser ska displaya det, 
        ge mig en detaljerad beskrivning av ordet 'abnorm' på svenska, 
        inkludera ordets betydelse, användning i meningar, och eventuella synonymer 
        eller relaterade ord. Formatera svaret i HTML så att det är lätt att läsa och förstå.`,
    });

    console.log("Gemini's Response:\n");
    console.log(response.text);
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
  }
}
wikiRouter.get("/test-gen-ai", async (req, res) => {
  try {
    // Call the model (gemini-3.5-flash is ideal for fast, general text tasks)
    const response = await generateText();
    // return html
    return res.send(response);
    // return res.json({ response });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return res.json({ error: "Error communicating with Gemini API" });
  }
});

interface GenerateRequestBody {
  word: string;
  definition: string;
  sentences: string[];
}
wikiRouter.get("/generate", async (req, res) => {
  const generatedDataFile = fs.readFileSync(
    "words/generated/final.json",
    "utf-8",
  );
  const generatedData: Record<string, GenerateRequestBody> =
    JSON.parse(generatedDataFile);

  const existingWordData = generateWordDataStructureOnDataset();

  for (let index = 500; index < existingWordData.length; index++) {
    const wordData = existingWordData[index];
    if (generatedData[wordData.word]) {
      console.log(
        `Skipping word ${wordData.word} because it already has generated data`,
      );
      continue;
    }
    try {
      // Call the model (gemini-3.5-flash is ideal for fast, general text tasks)
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `svara på strict json format enligt detta schema {
  "word": string,
  "definition": string,
  "sentences": string[]
} där word är ordet som ska beskrivas, 
 definition är några meningar om ordet så att man får en väldigt bra överblick och förståelse, börja gärna att nämna synonymen som hittas i shortDefinition och få det att flyta in i resten av definitionen,
 notera att ordet kan ha flera betydelser och du kan ta hjälp utav datan jag skickar med. 
 sentences är en lista med 10 meningar som visar hur ordet används i dess vanligaste sammanhang 
 och också använder sig utav några olika ordformer på ordet. Ge mig en detaljerad beskrivning av ordet '${wordData.word}' på svenska
  Formatera svaret i strikt JSON så att inga modificationer på ditt svar måste göras för att använda det i en applikation. 
  till hjälp så att du använder det ord jag syftar på så får du lite existerande data om ordet ${JSON.stringify(wordData)}.`,
      });
      console.log(`Generated data for word ${wordData.word}, index ${index}`);

      const responseJson = JSON.parse(response.text || "{}");
      generatedData[wordData.word] = responseJson;
      console.log("definition:", responseJson.definition);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      fs.writeFileSync(
        "words/generated/final.json",
        JSON.stringify(generatedData),
      );
    }
    if (index % 100 === 0 && index !== 0) {
      fs.writeFileSync(
        "words/generated/final.json",
        JSON.stringify(generatedData),
      );
    }

    // fs.writeFileSync(
    //   `words/generated/${wordData.word}.json`,
    //   JSON.stringify(responseJson, null, 2),
    // );
  }
  fs.writeFileSync("words/generated/final.json", JSON.stringify(generatedData));
  //   return res.json(responseJson);
  //   // return res.json({ response });
  // } catch (error) {
  //   console.error("Error communicating with Gemini API:", error);
  //   return res.json({ error: "Error communicating with Gemini API" });
  // }
});

export default wikiRouter;
