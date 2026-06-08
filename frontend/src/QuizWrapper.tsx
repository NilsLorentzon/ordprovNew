import { useQuery } from "@tanstack/react-query";
import { axios } from "./lib/axios";
import Quiz, { type WordDataQuizExtended } from "./Quiz";
import { useState } from "react";
import { v4 as uuid } from "uuid";
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
export interface Repetition {
  userId: string;
  word: string;
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
export default function QuizWrapper() {
  const {
    data: wordData,
    isLoading: isWordDataLoading,
    refetch: refetchWordData,
  } = useQuery({
    queryKey: ["words"],
    queryFn: (): Promise<WordDataQuiz[]> => axios.get(`word/prov`),
    refetchOnWindowFocus: false,
    onSuccess: (data: WordDataQuiz[]) => {
      // setWords(
      //   data.map((wordObj) => ({
      //     ...wordObj,
      //     answer: wordObj.definitions.shortDefinition,
      //     correctAnswer: wordObj.definitions.shortDefinition,
      //     generatedTime: currentTime,
      //     answeredTime: currentTime,
      //     showInfo: true,
      //   })),
      // );
      // if (words.length === 0) {
      //   return;
      // }
      setWords(
        data.map((wordObj) => ({
          ...wordObj,
          answer: "",
          correctAnswer: wordObj.definitions.shortDefinition,
          generatedTime: new Date(wordObj.generatedTime),
          answeredTime: new Date(wordObj.generatedTime),
          showInfo: true,
        })),
      );
    },
  });
  const { data: repetitions, isLoading: isRepetitionsLoading } = useQuery({
    enabled: wordData !== undefined && wordData.length > 0,
    queryKey: ["repetitions"],
    queryFn: (): Promise<Repetition[]> =>
      axios.post(`repetition`, {
        words: wordData?.map((word) => word.word) || [],
      }),
  });

  const currentTime = new Date();

  const [words, setWords] = useState<WordDataQuizExtended[]>([]);
  const [quizId, setQuizId] = useState(uuid());
  const updateQuizId = () => {
    setQuizId(uuid());
  };
  if (
    isWordDataLoading ||
    wordData === undefined ||
    isRepetitionsLoading ||
    repetitions === undefined ||
    words.length === 0
  ) {
    return <div className=""></div>;
  }
  return (
    <Quiz
      updateQuizId={updateQuizId}
      words={words}
      repetitions={repetitions}
      refetchWordData={refetchWordData}
      setWords={setWords}
    />
  );
}
