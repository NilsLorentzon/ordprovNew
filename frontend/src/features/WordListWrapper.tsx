import { useQuery } from "@tanstack/react-query";
import type { Repetition } from "../QuizWrapper";
import { axios } from "../lib/axios";
import WordList, { type Word } from "./WordList";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// import { AuthContext } from "../providers/AuthenticationProvider";
// import { useContext } from "react";

export default function WordListWrapper() {
  // const { auth } = useContext(AuthContext);
  const { word } = useParams();
  const { data: repetitions, isLoading: isRepetitionsLoading } = useQuery({
    // enabled: !!auth.email,
    queryKey: ["repetitions"],
    queryFn: (): Promise<Repetition[]> => axios.post(`repetition/all`, {}),
  });

  const { data: wordList, isLoading: isWordListLoading } = useQuery({
    queryKey: ["wordList"],
    queryFn: (): Promise<Word[]> => axios.get(`word/`),
  });

  if (isWordListLoading || wordList === undefined) {
    return <div></div>;
  }

  if (isRepetitionsLoading || repetitions === undefined) {
    return <div></div>;
  }

  // const isUniqueWord = wordList.find((w) => w.word === word);
  const matchedWord = wordList.find((w) => w.word === word);
  // Fallback defaults if the word isn't found
  const pageTitle = matchedWord
    ? `Vad betyder ${matchedWord.word}?`
    : "Ordprov.com | Ordlista på tidigare högskoleprov";

  const pageDescription = matchedWord
    ? `Vad betyder ${matchedWord.word}? Definitioner och exempelmeningar för ord på tidigare högskoleprov.`
    : "Definitioner och exempelmeningar för ord på tidigare högskoleprov.";
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
      </Helmet>

      <WordList
        repetitions={repetitions}
        wordList={wordList}
        word={word || ""}
      />
    </>
  );
}
