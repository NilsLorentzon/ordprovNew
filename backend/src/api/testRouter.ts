import express from "express";
import axios from "axios";
import puppeteer from "puppeteer";
import fs from "fs";
import * as cheerio from "cheerio";
import multer from "multer";
import path from "path";

const testRouter = express.Router();

const currentWord = "a";

const wordClassesEnglishToSwedish = {
  noun: "substantiv",
  adjective: "adjektiv",
  verb: "verb",
  adverb: "adverb",
  pronoun: "pronomen",
  numeral: "räkneord",
  preposition: "preposition",
  conjunction: "konjunktion",
  subordinatingConjunction: "subjunktion",
  interjection: "interjektion",
};
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

testRouter.get("/get-word-list", async (req, res) => {
  // Launch the browser and open a new blank page.
  const browser = await puppeteer.launch();
  // const browser = await puppeteer.launch({
  //     headless: false,  // This opens the actual Chrome window
  //     slowMo: 100,      // Optional: slows down operations by 100ms so you can see what's happening
  //     devtools: true    // Optional: automatically opens Chrome DevTools
  // });
  const page = await browser.newPage();
  const file = fs.readFileSync("words/words.json", "utf-8");
  const existingWordsHashmap: Record<string, string> = JSON.parse(file);
  const wordList = Object.keys(existingWordsHashmap);
  const lastWord = wordList[wordList.length - 1] || currentWord;
  await page.goto(
    `https://svenska.se/?activeTab=saol&q=${lastWord}&exactMatch=true`,
  );
  await page.setViewport({ width: 1080, height: 1024 });

  // const html = await page.content();

  await page.waitForSelector("[data-word]");

  const wordHashmap: Record<string, string> = existingWordsHashmap;
  let currentLoopIndex = 0;
  while (true) {
    // Re-fetch elements every time because the list is growing
    const elements = await page.$$("[data-word]");
    // get all the inner htmls of the elements and push them to the words array
    const innerHTMLs = await Promise.all(
      elements.map((el) => page.evaluate((e) => e.innerHTML, el)),
    );
    for (const innerHTML of innerHTMLs) {
      const word = innerHTML.trim();
      if (!wordHashmap[word]) {
        wordHashmap[word] = word;
        console.log(`Word: `, word);
      }
    }
    const lastElement = elements[elements.length - 1];
    await lastElement.scrollIntoView();
    if (currentLoopIndex % 100 === 0) {
      fs.writeFileSync(
        `words/words${currentLoopIndex}.json`,
        JSON.stringify(wordHashmap, null, 2),
      );
    }
    currentLoopIndex++;
    console.log(`Loop index: ${currentLoopIndex}`);
  }

  // while (hasMore || currentIndex > 100) {

  //     //scorll to last element

  //     // if (currentIndex < elements.length ) {
  //     //     const element = elements[currentIndex];

  //     //     // 1. Scroll the current element into view
  //     //     // This usually triggers the site's JS to load more items
  //     //     await element.scrollIntoView();

  //     //     // 2. Extract the innerHTML
  //     //     const innerHTML = await page.evaluate(el => el.innerHTML, element);
  //     //     console.log(`Word ${currentIndex + 1}:`, innerHTML.trim());

  //     //     words.push(innerHTML.trim());
  //     //     currentIndex++;

  //         // 3. Optional: Brief pause to allow the site's lazy-loader to react
  //         // await new Promise(r => setTimeout(r, 200));
  //     }
  //     // else {
  //     //     // Check if more elements appeared after scrolling the last one
  //     //     // We wait a bit longer here to be sure no more are loading
  //     //     // await new Promise(r => setTimeout(r, 1000));
  //     //     const updatedElements = await page.$$('[data-word]');

  //     //     if (updatedElements.length === elements.length) {
  //     //         console.log("No more elements loading. Finished.");
  //     //         hasMore = false;
  //     //     }
  //     // }
  // }

  return res.json({ success: true });
});

const getCorpora = async () => {
  const url = "https://ws.spraakbanken.gu.se/ws/korp/v8/info";
  try {
    const response = await axios.get(url);
    const corpora = response.data.corpora;
    return corpora;
  } catch (error) {
    console.error("Error fetching corpora:", error);
    return [];
  }
};
testRouter.get("/get-corpora", async (req, res) => {
  const corpora = await getCorpora();
  return res.json(corpora);
});
testRouter.get("/corpora-info", async (req, res) => {
  const allCorpora = await getCorpora();
  const selectedCorpora = allCorpora.filter((corpus: any) => {
    if (["WIKIPEDIA-SV"].includes(corpus)) {
      return true;
    }
    return false;
  });
  const corporaUrlString = selectedCorpora.join(",");
  const url = `https://ws.spraakbanken.gu.se/ws/korp/v8/corpus_info?corpus=${corporaUrlString}`;
  console.log("Fetching corpus info for:", url);
  try {
    const response = await axios.get(url);
    const corpora = response.data;
    return res.json(corpora);
  } catch (error) {
    // console.error("Error fetching corpora:", error);
    return res.json([]);
  }
});

interface WordAppended {
  word: string;
  partOfSpeech: string;
  forms: {
    word: string;
    formTags: string[];
  }[];
}
testRouter.get("/free-dictionary-append", async (req, res) => {
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

testRouter.get("/get-hp-words", async (req, res) => {
  const words: { word: string; definition: string; page: number }[] = [];
  const browser = await puppeteer.launch({
    headless: false, // This opens the actual Chrome window
    slowMo: 100, // Optional: slows down operations by 100ms so you can see what's happening
    devtools: true, // Optional: automatically opens Chrome DevTools
  });
  const url = `https://community-courses.memrise.com/community/course/1892481/alla-gamla-ordprov-1977-2017/1/`;
  const page = await browser.newPage();
  page.goto(url);

  await new Promise((r) => setTimeout(r, 60000)); // Wait for 5 seconds to allow the user to log in
  for (let index = 1; index <= 48; index++) {
    const pageIndex = (48)[index];
    const url = `https://community-courses.memrise.com/community/course/1892481/alla-gamla-ordprov-1977-2017/${pageIndex}/`;
    const page = await browser.newPage();
    try {
      // website requires login so need to convert to puppeteer, but we can still use cheerio to parse the html
      page.goto(url);
      await page.waitForSelector(".thing.text-text");
      const html = await page.content();
      const $ = cheerio.load(html);
      // get all elements with classes "thing text-text"
      const wordElements = $(".thing.text-text");
      // loop through the elements and get the inner text from the div.text inside of div.col_a and div.col_b

      wordElements.each((i, el) => {
        const wordA = $(el).find(".col_a .text").text().trim();
        const wordB = $(el).find(".col_b .text").text().trim();
        words.push({ word: wordA, definition: wordB, page: pageIndex });
        console.log(`Word A: ${wordA}, Word B: ${wordB}`);
      });
      console.log(`Fetched corpora page ${pageIndex}`);
    } catch (error) {
      console.error("Error fetching corpora page:", error);
    }
    await new Promise((r) => setTimeout(r, 300)); // Sleep for 1 second between requests to be polite to the server
  }
  fs.writeFileSync(`words/hpWords.json`, JSON.stringify(words));
});

testRouter.get("/convert-hp", async (req, res) => {
    const file = fs.readFileSync("words/wordsHP.text", "utf-8");
    // the list has the word and then the definitinion on the next line, when the line is empty we know its a new page (new quiz year on memrise)
    console.log("Converting HP words...");
    const lines = file.split("\n");
     console.log(`Total lines: ${lines.length}`);
    const words: { word: string; definition: string; page: number }[] = [];
    let currentPage = 1;
    // for loop should skip the next line after reading a word since its the definition, and when it encounters an empty line it should increase the page number
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index].trim();
        if (line === "") {
            currentPage++;
            continue;
        }
        const word = line;
        const definition = lines[index + 1]?.trim() || "";
        words.push({ word, definition, page: currentPage });
        index++; // Skip the next line since it's the definition
    }
    fs.writeFileSync(`words/hpWords.json`, JSON.stringify(words));
    return res.json({ success: JSON.stringify(words) });
});

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Keep the original filename generated by the frontend
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// 1. Endpoint to upload the audio file
testRouter.post('/upload', upload.single('audiofile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Generate a URL to replay the file later
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  
  res.json({ 
    message: 'Audio saved successfully!', 
    fileUrl: fileUrl 
  });
});

// 2. Serve the 'uploads' folder statically so the frontend can stream/replay files later
testRouter.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export default testRouter;
