export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastRequest: string;
}

export interface Repetition {
  userId: string;
  word: string;
}

export interface Word {
  word: string;
  createdTime: Date;
  definitions: {
    definition: string;
    shortDefinition: string;
    longDefinition: string;
  };
  sentences: string[];
  partsOfSpeech: string[];
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
  generatedTime: Date;
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
