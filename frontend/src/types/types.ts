export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastRequest: string;
}

export type Question = {
  userId: string;
  createdAt: Date;
  word: string;
  alternativeWords: {
    word: string;
    definition: string;
  }[];
  correctAnswer: string;
  answer: string;
  isCorrect: boolean;
  quizType: "multipleChoice" | "writeDefinition";
  writenDefinitionAnswer: string;
  answeredAt: Date;
};

export interface Repetition {
  userId: string;
  word: string;
}

export interface Word {
  word: string;
  definitions: {
    definition: string;
    shortDefinition: string;
    longDefinition: string;
  };
  sentences: string[];
  partsOfSpeech: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningCard {
  userId: string;
  cardId: string;
  word: string;
  createdAt: Date;

  // FSRS Specific Fields:
  due: Date; // Next review date
  stability: number; // Memory stability
  difficulty: number; // Card difficulty
  scheduled_days: number; // Scheduled days until next review
  reps: number; // Total repetitions
  lapses: number; // Times forgotten
  state: number; // Card state (0: New, 1: Learning, 2: Review, 3: Relearning)
  last_review?: Date; // Timestamp of the last review
}




export interface WordDataQuiz {
  word: string;
  definitions: {
    shortDefinition: string;
    definition: string;
    longDefinition: string;
  };
  partsOfSpeech: string[];
  sentences: string[];
  alternatives: { word: string; definition: string }[];
  createdAt: string;
  updatedAt: string;
  answeredAt: string;
}
export interface LearningCardWithWord extends LearningCard {
  wordData: WordDataQuiz;

}
export interface WordDataQuizExtended extends WordDataQuiz {
  correctAnswer: string;
  answer: string;
  answeredTime: Date;
  showInfo: boolean;
  writenDefinitionText: string;
  writenDefinitionIsCorrect: boolean;
  writenDefinitionSubmited: boolean;
  showDefinition: boolean;
}

export type QuizTypes = "multipleChoice" | "writeDefinition";

export interface AdminData {
  verifiedUsers: {
    userId: string;
    email: string;
    userName: string;
    lastRequest: Date;
  }[];
  amountOfVerifiedUsers: number;
}
