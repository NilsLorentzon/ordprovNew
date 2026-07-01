import express from "express";
import { Router, Request, Response } from "express";
import { fsrs, createEmptyCard, Rating, Card } from "ts-fsrs";
import { LearningModel } from "../Models/LearningModel";
import { WordModel } from "../Models/WordModel";
import { authenticateToken } from "./authenticationRouter";

const learningRouter = express.Router();
const scheduler = fsrs(); // Initialize FSRS scheduler with default settings

learningRouter.post(
  "/initialize",
  authenticateToken,
  async (req: Request, res: Response) => {
    const amountOfNewCards = 20; // Number of new cards to initialize for the user
    const words = await WordModel.aggregate([
      { $sample: { size: amountOfNewCards } },
    ]);
    const userId = req.currentUserId;
    console.log("Initializing learning cards for user:", userId);
    for (let i = 0; i < words.length; i++) {
      console.log(`Creating card for word: ${words[i].word}`);
      const word = words[i].word;
      const fsrsBlankCard = createEmptyCard();
      const newCard = await LearningModel.create({
        userId,
        word,
        createdAt: new Date(),
        ...fsrsBlankCard,
      });
    }
    res.json({
      message: `${amountOfNewCards} new cards initialized for user ${userId}`,
    });
  },
);

learningRouter.get(
  "/cards",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // get all cards for the user, sorted by due date
      const userId = req.currentUserId;
      const cards = await LearningModel.find({ userId })
        .sort({ due: 1 })
        .exec();

      const words = await WordModel.find({
        word: { $in: cards.map((c) => c.word) },
      }).exec();

      res.json({ cards, words });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  },
);
learningRouter.post("/cards", async (req: Request, res: Response) => {
  try {
    const { word } = req.body;

    // const newCard = await learningHandler.createCard(req.currentUserId, word);

    res.status(201).json({ message: "Card created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

// ==========================================
// ENDPOINT 2: Preview intervals (Optional but highly recommended)
// Shows the user what the next interval will be for each button (Again, Hard, Good, Easy)
// ==========================================
// learningRouter.get(
//   "/cards/:id/preview",
//   async (req: Request, res: Response) => {
//     try {
//       const card = await db.getCardById(req.params.id);
//       if (!card) return res.status(404).json({ error: "Card not found" });

//       const now = new Date();

//       // Pass the saved database FSRS properties back into scheduler.repeat
//       const preview = scheduler.repeat(card as Card, now);

//       // Map out the response nicely for your frontend buttons
//       const intervalsPreview = {
//         [Rating.Again]: preview[Rating.Again].card.due,
//         [Rating.Hard]: preview[Rating.Hard].card.due,
//         [Rating.Good]: preview[Rating.Good].card.due,
//         [Rating.Easy]: preview[Rating.Easy].card.due,
//       };

//       res.json({ card, intervals: intervalsPreview });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to generate preview" });
//     }
//   },
// );

// ==========================================
// ENDPOINT 3: Submit review outcome (The core FSRS feature)
// ==========================================
// learningRouter.post(
//   "/cards/:id/review",
//   async (req: Request, res: Response) => {
//     try {
//       const { rating } = req.body; // Expects a number 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)

//       if (![1, 2, 3, 4].includes(rating)) {
//         return res
//           .status(400)
//           .json({
//             error: "Invalid rating. Must be 1 (Again) through 4 (Easy).",
//           });
//       }

//       const card = await db.getCardById(req.params.id);
//       if (!card) return res.status(404).json({ error: "Card not found" });

//       const now = new Date();

//       // Call scheduler.next to compute the new scheduling state and log metrics
//       // ts-fsrs accepts the database record if it mirrors the properties of the Card interface
//       const result = scheduler.next(card as Card, now, rating as Rating);

//       // Persist both the newly updated card attributes and optionally save the review log history
//       await db.updateCard(req.params.id, result.card);
//       // (Optional) await db.saveReviewLog(result.log);

//       res.json({
//         message: "Card updated successfully!",
//         nextDue: result.card.due,
//         cardState: result.card,
//       });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to process card review" });
//     }
//   },
// );

export default learningRouter;
