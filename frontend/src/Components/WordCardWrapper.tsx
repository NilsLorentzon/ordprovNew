import React from "react";
import type { Word } from "../types/types";
import { axios } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import WordCard from "../features/WordCard";

interface Props {
  word: string;
}
export default function WordCardWrapper({ word }: Props) {
  const { data: wordData, isLoading: isWordDataLoading } = useQuery({
    queryKey: ["wordData", word],
    queryFn: (): Promise<Word | undefined> => axios.get(`word/${word}`),
  });

  if (isWordDataLoading || wordData === undefined || word === "") {
    return <div></div>;
  }
  return <WordCard wordData={wordData} />;
}
