import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { v4 as uuid } from "uuid";
import type { Question } from "../types/types";

const example = {
  userId: "be282496-7b06-4798-a917-9cf8f093fb62",
  word: "instinktiv",
  alternativeWords: [
    {
      word: "instinktiv",
      definition: "omedveten",
    },
    {
      word: "animerad",
      definition: "livlig",
    },
    {
      word: "komparativ",
      definition: "jämförande",
    },
    {
      word: "skenhelig",
      definition: "hycklande",
    },
    {
      word: "gängse",
      definition: "bruklig",
    },
  ],
  correctAnswer: "omedveten",
  answer: "omedveten",
  isCorrect: true,
  quizType: "multipleChoice",
  writenDefinitionAnswer: "",
  createdAt: new Date("2026-06-13T18:27:49.152Z"),
  answeredAt: new Date("2026-06-13T18:27:49.152Z"),
};

interface StorageData {
  userStorageId: string;
  questions: Question[];
}

const defaultValue = {
  storageData: {
    userStorageId: "",
    questions: [] as Question[],
  },
  setQuestions: () => console.log("wrap in provider"),
  setNewQuestion: () => console.log("wrap in provider"),

  setStorageData: () => console.log("wrap in provider"),
};

interface LocalStorageContextType {
  storageData: StorageData;
  setQuestions: (questions: Question[]) => void;
  setNewQuestion: (question: Question) => void;
  setStorageData: Dispatch<SetStateAction<StorageData>>;
}
const LocalStorageContext =
  createContext<LocalStorageContextType>(defaultValue);

const getAllDataFromLocalStorage = () => {
  let userStorageId = localStorage.getItem("userStorageId");

  if (!userStorageId) {
    userStorageId = uuid();
    localStorage.setItem("userStorageId", userStorageId);
  }
  const questionsString = localStorage.getItem("questions");
  let questions: Question[] = [];
  if (questionsString) {
    questions = JSON.parse(questionsString);
  } else {
    questions = [];
    localStorage.setItem("questions", JSON.stringify(questions));
  }
  return {
    userStorageId: userStorageId,
    questions: questions,
  };
};

interface Props {
  children: ReactNode;
}
function LocalStorageProvider({ children }: Props) {
  let { userStorageId, questions } = getAllDataFromLocalStorage();
  const [storageData, setStorageData] = useState<StorageData>({
    userStorageId: userStorageId,
    questions: questions,
  });

  const setQuestions = (questions: Question[]) => {
    if (questions.length > 100) {
      return;
    }
    localStorage.setItem("questions", JSON.stringify(questions));
    setStorageData((prev) => ({ ...prev, questions }));
  };

  const setNewQuestion = (question: Question) => {
    const updatedQuestions = [...storageData.questions, question];
    if (updatedQuestions.length > 100) {
      return;
    }
    setQuestions(updatedQuestions);
  };

  const value = useMemo(
    () => ({
      storageData,
      setStorageData,
      // setUserStorageId,
      setQuestions,
      setNewQuestion,
    }),
    [storageData],
  );
  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}

export { LocalStorageContext, LocalStorageProvider };
