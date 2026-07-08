import express from "express";
import { Router, Request, Response } from "express";
import { LearningModel } from "../Models/LearningModel";
import { WordModel } from "../Models/WordModel";
import { authenticateToken } from "./authenticationRouter";
import { z } from "zod";
import { fsrs, createEmptyCard, Rating, Card } from "ts-fsrs";

const scheduler = fsrs();
const learningRouter = express.Router();

const amountOfNewCardsPerDay = 1;

learningRouter.post(
  "/initialize",
  authenticateToken,
  async (req: Request, res: Response) => {
    const existingLearningCards = await LearningModel.find({
      userId: req.currentUserId,
    }).exec();
    if (existingLearningCards.length > 0) {
      return res.status(400).json({
        message: "Learning cards already initialized for this user.",
      });
    }

    const words = await WordModel.aggregate([
      { $sample: { size: amountOfNewCardsPerDay } },
    ]);
    const userId = req.currentUserId;
    console.log("Initializing learning cards for user:", userId);
    for (let i = 0; i < words.length; i++) {
      console.log(`Creating card for word: ${words[i].word}`);
      const word = words[i].word;
      const fsrsBlankCard = createEmptyCard();
      await LearningModel.create({
        userId,
        word,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...fsrsBlankCard,
      });
    }
    res.json({
      message: `${amountOfNewCardsPerDay} new cards initialized for user ${userId}`,
    });
  },
);

learningRouter.get(
  "/cards",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.currentUserId;
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      // Determine how many days have passed since the user's last activity
      const latestCard = await LearningModel.findOne({ userId })
        .sort({ updatedAt: -1 })
        .lean()
        .exec();

      let daysPassed = 0;
      if (!latestCard) {
        return res.json([]); // no cards yet -> return empty array
        // daysPassed = 1; // no cards yet -> add first-day batch
      } else {
        const lastDate = latestCard.updatedAt;
        const lastMidnight = new Date(lastDate);
        lastMidnight.setHours(0, 0, 0, 0);
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const msPerDay = 24 * 60 * 60 * 1000;
        daysPassed = Math.floor(
          (todayMidnight.getTime() - lastMidnight.getTime()) / msPerDay,
        );
      }

      if (daysPassed > 0) {
        const numberToAdd = daysPassed * amountOfNewCardsPerDay;
        const existingWords = await LearningModel.find({ userId })
          .distinct("word")
          .exec();
        const candidates = await WordModel.aggregate([
          { $match: { word: { $nin: existingWords } } },
          { $sample: { size: numberToAdd } },
        ]).exec();

        for (let i = 0; i < candidates.length; i++) {
          const w = candidates[i].word;
          const fsrsBlankCard = createEmptyCard();
          await LearningModel.create({
            userId,
            word: w,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...fsrsBlankCard,
          });
        }
      }

      // Aggregate learning cards with their full Word documents
      // const now = new Date();
      const cards = await LearningModel.aggregate([
        { $match: { userId, due: { $lte: endOfToday } } },
        { $sort: { due: 1 } },
        // { $limit: 100 },
        {
          $lookup: {
            from: "words",
            localField: "word",
            foreignField: "word",
            as: "wordData",
          },
        },
        { $unwind: { path: "$wordData", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            word: 1,
            userId: 1,
            createdAt: 1,
            updatedAt: 1,
            due: 1,
            stability: 1,
            difficulty: 1,
            scheduled_days: 1,
            reps: 1,
            lapses: 1,
            state: 1,
            last_review: 1,
            wordData: 1,
          },
        },
      ]).exec();

      return res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  },
);
learningRouter.post("/card", async (req: Request, res: Response) => {
  try {
    const { word, answer } = req.body;
    const validator = z.object({
      word: z.string(),
      answer: z.enum(["1", "2", "3", "4"]),
    });
    const validatedData = validator.parse({ word, answer });
    // find the user's card
    const userId = (req as any).currentUserId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cardDoc: any = await LearningModel.findOne({ userId, word }).exec();
    if (!cardDoc) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Build an FSRS-compatible card object from the stored document
    const fsrsCard: any = {
      due: cardDoc.due,
      stability: cardDoc.stability,
      difficulty: cardDoc.difficulty,
      scheduled_days: cardDoc.scheduled_days,
      reps: cardDoc.reps,
      lapses: cardDoc.lapses,
      state: cardDoc.state,
      last_review: cardDoc.last_review,
    };

    // Map the incoming answer (1-4) to a numeric rating. ts-fsrs expects a numeric rating; adjust mapping if your app uses different semantics.
    const rating = parseInt(validatedData.answer, 10);

    // Use the scheduler to compute the updated card
    const mapper = {
      1: Rating.Again,
      2: Rating.Hard,
      3: Rating.Good,
      4: Rating.Easy,
    };

    const updatedFsrsCard = scheduler.next(
      fsrsCard,
      new Date(),
      mapper[rating],
    );

    // Persist relevant fields back to the DB
    const update = {
      due: updatedFsrsCard.card.due,
      stability: updatedFsrsCard.card.stability,
      difficulty: updatedFsrsCard.card.difficulty,
      scheduled_days: updatedFsrsCard.card.scheduled_days,
      reps: updatedFsrsCard.card.reps,
      lapses: updatedFsrsCard.card.lapses,
      state: updatedFsrsCard.card.state,
      last_review: updatedFsrsCard.card.last_review || new Date(),
    } as any;

    await LearningModel.updateOne(
      { _id: cardDoc._id },
      { $set: update },
    ).exec();
    return res.status(200).json({ message: "Card updated", card: update });
  } catch (error) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

learningRouter.get(
  "/statistics",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.currentUserId;

      // Build next 14 days buckets (including today)
      const buckets: Array<{ date: string; count: number }> = [];
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      for (let i = 0; i < 14; i++) {
        const dayStart = new Date(startOfToday);
        dayStart.setDate(startOfToday.getDate() + i);
        const nextDayStart = new Date(dayStart);
        nextDayStart.setDate(dayStart.getDate() + 1);

        const count = await LearningModel.countDocuments({
          userId,
          due: { $gte: dayStart, $lt: nextDayStart },
        }).exec();

        buckets.push({ date: dayStart.toISOString().slice(0, 10), count });
      }

      // Count unique words the user has seen
      const uniqueWords = await LearningModel.distinct("word", { userId });
      const uniqueWordsCount = Array.isArray(uniqueWords)
        ? uniqueWords.length
        : 0;

      return res.json({ upcomingDailyRepetitions: buckets, uniqueWordsCount });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch statistics" });
    }
  },
);

export default learningRouter;
