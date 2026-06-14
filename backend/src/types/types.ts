import { Word } from "../Models/WordModel";

export interface WordData {
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
  alternatives: { word: string; definition: string }[];
  createdAt: Date;
  answeredAt: Date;
}

export type QuizTypes = "multipleChoice" | "writeDefinition";
