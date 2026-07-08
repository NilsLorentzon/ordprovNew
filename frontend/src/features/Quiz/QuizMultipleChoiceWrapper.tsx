import { useQuery } from "@tanstack/react-query";
import { axios } from "../../lib/axios";
import Quiz from "./Quiz";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import type {
  QuizTypes,
  WordDataQuiz,
  WordDataQuizExtended,
} from "../../types/types";

export interface QuizSettings {
  amountOfQuestions: number;
  questionType: QuizTypes;
  alternativesAmount: number;
}
// export interface WordData {
//   word: string;
//   wordList: {
//     listName: string;
//     category: string;
//   }[];
//   partsOfSpeech: {
//     partOfSpeech: string;
//     conjugationsList: string[];
//     definitions: {
//       shortDefinition: string;
//       wikiDefinition: string;
//       definition: string;
//       longDefinition: string;
//     }[];
//     // frequency: number;
//   }[];
//   definition: string;
//   sentences: string[];
// }

// interface Props {
//   amountOfQuestions: number;
//   questionType: QuizTypes;
// }
export default function QuizMultipleChoiceWrapper() {
  // get parameters from url (used as initial defaults only)
  const urlParams = new URLSearchParams(window.location.search);

  const [settings, setSettings] = useState<QuizSettings>({
    amountOfQuestions: parseInt(urlParams.get("antal") || "10"),
    questionType: (urlParams.get("typ") || "multipleChoice") as QuizTypes,
    alternativesAmount: parseInt(urlParams.get("alternativ") || "5"),
  });

  const {
    data: wordData,
    isLoading: isWordDataLoading,
    refetch: refetchWordData,
  } = useQuery({
    queryKey: ["words", settings],
    queryFn: (): Promise<WordDataQuiz[]> =>
      axios.get(
        `word/prov?antal=${settings.amountOfQuestions}&typ=${settings.questionType}${settings.questionType === "multipleChoice" ? `&alternativ=${settings.alternativesAmount}` : ""}`,
      ),
    refetchOnWindowFocus: false,
    onSuccess: (data: WordDataQuiz[]) => {
      setWords(
        data.map((wordObj) => ({
          ...wordObj,
          answer: "",
          correctAnswer: wordObj.definitions.shortDefinition,
          showInfo: true,
          writenDefinitionText: "",
          writenDefinitionSubmited: false,
          writenDefinitionIsCorrect: false,
          showDefinition: false,
          answeredTime: new Date(wordObj.answeredAt),
        })),
      );
    },
  });

  const [words, setWords] = useState<WordDataQuizExtended[]>([]);
  const [quizId, setQuizId] = useState(uuid());
  const updateQuizId = () => {
    setQuizId(uuid());
  };

  const applySettings = (newSettings: QuizSettings) => {
    setWords([]);
    setSettings(newSettings);
  };

  if (isWordDataLoading || wordData === undefined || words.length === 0) {
    return <div className=""></div>;
  }

  return (
    <Quiz
      updateQuizId={updateQuizId}
      words={words}
      refetchWordData={refetchWordData}
      setWords={setWords}
      quizType={settings.questionType}
      settings={settings}
      onApplySettings={applySettings}
    />
  );
}
