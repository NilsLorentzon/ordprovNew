import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { axios } from './lib/axios';
import Quiz from './Quiz';

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
export interface WordDataQuiz {
  word: string;
  definitions: {
    shortDefinition: string;
    definition: string;
    longDefinition: string;
  };
  partsOfSpeech: string[];
  sentences: string[];
  alternatives: string[];
}
export default function QuizWrapper() {
  const { data: wordData, isLoading: isWordDataLoading } =
    useQuery(
      ["words"],
      (): Promise<WordDataQuiz[]> =>
        axios.get(`wiki/generate-WordData-structure-on-dataset`),
    );
    console.log("wordData", wordData, isWordDataLoading);
    if (isWordDataLoading || wordData === undefined) {
    return <div className=""></div>
  }
  return (
    <Quiz wordData={wordData} />
  )
}
