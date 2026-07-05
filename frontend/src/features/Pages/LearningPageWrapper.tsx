import React, { useState } from "react";
import type {
  LearningCardWithWord,
  WordDataQuiz,
  WordDataQuizExtended,
} from "../../types/types";
import { axios } from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import LearningPage from "./LearningPage";

export default function LearningPageWrapper() {
  const {
    data: wordData,
    isLoading: isWordDataLoading,
    refetch: refetchWordData,
  } = useQuery({
    queryKey: ["words"],
    queryFn: (): Promise<LearningCardWithWord[]> => axios.get(`learning/cards`),
    refetchOnWindowFocus: false,
    onSuccess: (data: LearningCardWithWord[]) => {
      console.log("Fetched word data:", data);
      setWords(data);
    },
  });

  const [words, setWords] = useState<LearningCardWithWord[]>(wordData || []);

  if (isWordDataLoading || !wordData) {
    return <div>Loading...</div>;
  }

  return (
    <LearningPage
      words={words}
      refetchWordData={refetchWordData}
      setWords={setWords}
    />
  );
}
