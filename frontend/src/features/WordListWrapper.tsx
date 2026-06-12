import { useQuery } from "@tanstack/react-query";
import type { Repetition } from "../QuizWrapper";
import { axios } from "../lib/axios";
import WordList from "./WordList";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Word } from "../types/types";
// import { AuthContext } from "../providers/AuthenticationProvider";
// import { useContext } from "react";

export default function WordListWrapper() {
  // const { auth } = useContext(AuthContext);
  const { word } = useParams();
  // const { data: repetitions, isLoading: isRepetitionsLoading } = useQuery({
  //   // enabled: !!auth.email,
  //   queryKey: ["repetitions"],
  //   queryFn: (): Promise<Repetition[]> => axios.post(`repetition/all`, {}),
  // });

  const { data: wordList, isLoading: isWordListLoading } = useQuery({
    queryKey: ["wordList"],
    queryFn: (): Promise<
      {
        word: string;
        partsOfSpeech: string[];
      }[]
    > => axios.get(`word/`),
  });
  const { data: wordData, isLoading: isWordDataLoading } = useQuery({
    queryKey: ["wordData", word],
    queryFn: (): Promise<Word | undefined> => axios.get(`word/${word}`),
  });

  if (isWordListLoading || wordList === undefined) {
    return <div></div>;
  }
  if (isWordDataLoading || wordData === undefined) {
    return <div></div>;
  }
  // console.log("Loaded word list:", wordList);

  // if (isRepetitionsLoading || repetitions === undefined) {
  //   return <div></div>;
  // }

  // const isUniqueWord = wordList.find((w) => w.word === word);
  const matchedWordIndex = wordList.findIndex((w) => w.word === word);
  const matchedWord = wordList[matchedWordIndex];
  // Fallback defaults if the word isn't found
  const pageTitle = matchedWord
    ? `Vad betyder ${matchedWord.word}?`
    : "Ordprov.com | Ordlista på tidigare högskoleprov";

  const pageDescription = matchedWord
    ? `Vad betyder ${matchedWord.word}? Definitioner och exempelmeningar för ord på tidigare högskoleprov.`
    : "Definitioner och exempelmeningar för ord på tidigare högskoleprov.";
  // console.log("Page title:", wordData);

  const previousWord =
    matchedWordIndex > 0 ? wordList[matchedWordIndex - 1].word : null;
  const nextWord =
    matchedWordIndex < wordList.length - 1
      ? wordList[matchedWordIndex + 1].word
      : null;
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <WordList
        // repetitions={repetitions}
        wordList={wordList}
        wordData={wordData}
        previousWord={previousWord}
        nextWord={nextWord}
      />
    </>
  );
}
