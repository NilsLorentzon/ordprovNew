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
  // get parameters from url
  const urlParams = new URLSearchParams(window.location.search);
  const amountOfQuestions = urlParams.get("antal") || "10";
  const questionType = urlParams.get("typ") || "multipleChoice";
  const alternativesAmount = urlParams.get("alternativ") || "4";

  const {
    data: wordData,
    isLoading: isWordDataLoading,
    refetch: refetchWordData,
  } = useQuery({
    queryKey: ["words"],
    queryFn: (): Promise<WordDataQuiz[]> =>
      axios.get(
        `word/prov?antal=${amountOfQuestions}&typ=${questionType}${questionType === "multipleChoice" ? `&alternativ=${alternativesAmount}` : ""}`,
      ),
    refetchOnWindowFocus: false,
    onSuccess: (data: WordDataQuiz[]) => {
      setWords(
        data.map((wordObj) => ({
          ...wordObj,
          answer: "",
          // answer: wordObj.definitions.shortDefinition,
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

  if (isWordDataLoading || wordData === undefined || words.length === 0) {
    return <div className=""></div>;
  }

  return (
    <Quiz
      updateQuizId={updateQuizId}
      words={words}
      refetchWordData={refetchWordData}
      setWords={setWords}
      // amountOfQuestions={parseInt(amountOfQuestions)}
      quizType={questionType as QuizTypes}
    />
  );
}
