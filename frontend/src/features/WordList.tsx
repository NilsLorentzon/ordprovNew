import { useMutation } from "@tanstack/react-query";
import { axios } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthenticationProvider";
import { queryClient } from "../lib/react-query";
import Example from "./ComplexSearch/Example";
import ListIcon from "../assets/SVG/ListIcon";
import type { Word } from "../types/types";
import WordCard from "./WordCard";
import { routePaths } from "../routes/MainRoutes";

interface Props {
  // repetitions: Repetition[];
  wordList: {
    word: string;
    partsOfSpeech: string[];
  }[];
  // word: string;
  wordData: Word | undefined;
  previousWord: string | null;
  nextWord: string | null;
}
export default function WordList({
  wordList,
  wordData,
  previousWord,
  nextWord,
}: Props) {
  const { auth } = useContext(AuthContext);
  const [filterText, setFilterText] = useState(wordData ? wordData.word : "");
  const navigate = useNavigate();
  const repetitionUpdateMutation = useMutation(
    ["repetitions", "word"],
    ({
      repetition,
      isBookmarked,
    }: {
      repetition: string;
      isBookmarked: boolean;
    }) => {
      return axios.post(`repetition/word`, { word: repetition, isBookmarked });
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["repetitions"]);
        queryClient.invalidateQueries({
          queryKey: ["repetitions"],
        });
      },
    },
  );

  // const isWordInsideList = wordList.some((wordObj) => wordObj.word === word);

  // console.log("Current word:", currentWord);
  // console.log("Is word inside list?", isWordInsideList);
  // useEffect(() => {
  //   console.log("URL param word:", word);
  //   setFilterText(word);
  //   // unfocus search input when word changes
  //   const searchInput = document.getElementById(
  //     "search-input",
  //   ) as HTMLInputElement | null;
  //   if (searchInput) {
  //     searchInput.blur();
  //   }
  // }, [word]);
  // change url to current word without reloading the page
  // window.history.pushState(null, "", `${routePaths.ordlista}/${currentWord}`);
  // navigate(`${routePaths.ordlista}/${currentWord}`);

  // filter word list so that if filter text is "ab", it matches "ab", "abc", "abacus" but not "a" or "b"
  const filteredWordList = wordList.filter((wordObj) =>
    wordObj.word.toLowerCase().startsWith(filterText.toLowerCase()),
  );

  const searchList = filterText.length < 1 ? [] : filteredWordList;
  // console.log("Filter text:", filterText);

  // useEffect(() => {
  //   if (wordData) {
  //     setFilterText(wordData.word);
  //   }
  // }, [wordData]);
  return (
    <div className="p-0 pt-8  sm:p-8  min-h-full ">
      <div className="p-2 max-w-3xl mx-auto  rounded-md border border-black/0 h-full">
        <div className="p-8 lg:px-16 px-0 flex flex-col items-center gap-2">
          <h2 className="text-2xl text-center sm:text-3xl font-medium lg:tracking-tight mb-4">
            Ordlista för alla gamla ord från högskoleprovet
          </h2>
          <div className="w-full flex gap-2 relative px-8">
            <div className="w-full">
              <Example
                filterText={filterText}
                setFilterText={setFilterText}
                setCurrentWord={(word: string) => {
                  navigate(`${routePaths.ordlista}/${word}`);
                  // unfocus search input when word is clicked
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }}
                wordList={searchList}
              />
            </div>
            {/* <button
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
              aria-label="Visa alla ord"
            >
              <ListIcon className="w-5 h-5 fill-black" />
            </button> */}
          </div>
        </div>
        <div className="my-6"></div>
        {wordData && (
          <div
            className="p-4 border-p-200/20 border shadow-md rounded-md bg-white pt-3 p-4 mb-4 max-w-2xl m-auto"
            id={wordData.word}
            key={wordData.word}
          >
            {/* <h2 className="text-2xl mb-0">
                <Link to={`/ordlista/${word.word}`} className=" ml-2">
                  <span>{word.word}</span>
                </Link>
              </h2> */}
            <WordCard wordData={wordData} />
          </div>
        )}
      </div>
    </div>
  );
}
