import { useMutation } from "@tanstack/react-query";
import { axios } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthenticationProvider";
import BookmarkIcon from "../assets/SVG/BookmarkIcon";
import { queryClient } from "../lib/react-query";
import type { Repetition } from "../QuizWrapper";
import { MoreVertical } from "lucide-react";
import SpeakerIcon from "../assets/SVG/SpeakerIcon";
import { Menu, MenuItem, MenuTrigger } from "../Components/Menu";
import { Button } from "../Components/Button";
import { PartOfSpeech } from "../Quiz";
import clsx from "clsx";
import ControlledSelect from "../Components/ControlledSelect";
import Example from "./ComplexSearch/Example";
import { routePaths } from "../routes/MainRoutes";
import ListIcon from "../assets/SVG/ListIcon";

export interface Word {
  word: string;
  createdTime: Date;
  definitions: {
    definition: string;
    shortDefinition: string;
    longDefinition: string;
  };
  sentences: string[];
  partsOfSpeech: string[];
}
interface Props {
  repetitions: Repetition[];
  wordList: Word[];
  word: string;
}
export default function WordList({ repetitions, wordList, word }: Props) {
  const { auth } = useContext(AuthContext);
  const [filterText, setFilterText] = useState(word);
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

  const isWordInsideList = wordList.some((wordObj) => wordObj.word === word);

  // console.log("Current word:", currentWord);
  console.log("Is word inside list?", isWordInsideList);
  useEffect(() => {
    console.log("URL param word:", word);
    setFilterText(word);
    // unfocus search input when word changes
    const searchInput = document.getElementById(
      "search-input",
    ) as HTMLInputElement | null;
    if (searchInput) {
      searchInput.blur();
    }
  }, [word]);
  // change url to current word without reloading the page
  // window.history.pushState(null, "", `${routePaths.ordlista}/${currentWord}`);
  // navigate(`${routePaths.ordlista}/${currentWord}`);
  return (
    <div className="p-0 pt-8  sm:p-8  min-h-full ">
      <div className="p-2 max-w-3xl mx-auto bg-white rounded-md shadow-md border border-black/20 h-full">
        <div className="p-8 lg:px-16 px-0 flex flex-col items-center gap-2">
          <h2 className="text-2xl text-center sm:text-3xl font-medium lg:tracking-tight mb-4">
            Ordlista för alla gamla ord från högskoleprovet
          </h2>
          <div className="w-full flex gap-2 relative px-8">
            <div className="w-full">
              <Example
                filterText={filterText}
                setFilterText={setFilterText}
                setCurrentWord={(word: string) =>
                  navigate(`${routePaths.ordlista}/${word}`)
                }
                wordList={wordList.map((word) => ({
                  word: word.word,
                  partsOfSpeech: word.partsOfSpeech,
                }))}
              />
            </div>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
              aria-label="Visa alla ord"
            >
              <ListIcon className="w-5 h-5 fill-black" />
            </button>
          </div>
        </div>
        <div className="my-6"></div>
        {isWordInsideList &&
          [wordList.find((wordObj) => wordObj.word === word)!].map(
            (wordObj: Word) => {
              const isBookmarked = repetitions.some(
                (rep) => rep.word === wordObj.word,
              );
              return (
                <div
                  className="p-4 border-p-200/20 border shadow-md rounded-md bg-white pt-3 p-4 mb-4 max-w-2xl m-auto"
                  id={wordObj.word}
                  key={wordObj.word}
                >
                  {/* <h2 className="text-2xl mb-0">
                <Link to={`/ordlista/${word.word}`} className=" ml-2">
                  <span>{word.word}</span>
                </Link>
              </h2> */}
                  <div className="flex items-top justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl mb-0">
                        {/* <span className=" text-xl ">{index + 1}. </span> */}
                        <span>{wordObj.word}</span>
                      </h2>
                    </div>
                    <div className="">
                      {/* {auth.email && (
                        <button
                          aria-label={
                            isBookmarked ? "Ta bort bokmärke" : "Bokmärk ordet"
                          }
                          className="p-1"
                          onClick={() => {
                            repetitionUpdateMutation.mutate({
                              repetition: wordObj.word,
                              isBookmarked: !isBookmarked,
                            });
                          }}
                        >
                          <BookmarkIcon
                            className="w-5 h-5 hover:scale-125"
                            isSelected={isBookmarked}
                          />
                        </button>
                      )}
                      <button className="p-1" aria-label="Lyssna på ordet">
                        <SpeakerIcon className="w-5 h-5 fill-white hover:scale-125" />
                      </button> */}
                      <MenuTrigger>
                        <Button aria-label="Actions" variant="quiet">
                          <MoreVertical className="w-5 h-5 stroke-black " />
                        </Button>
                        <Menu className="bg-amber-300">
                          <MenuItem onAction={() => {}}>
                            <Link
                              to={`/ordlista/${wordObj.word}`}
                              className="w-full h-full"
                            >
                              <div className="">Öppna i ordlista</div>
                            </Link>
                          </MenuItem>
                        </Menu>
                      </MenuTrigger>
                    </div>
                  </div>
                  <div className="">
                    <div
                      className={clsx(
                        " border-0  rounded-md",
                        "border-p-200/40 p-2",
                      )}
                    >
                      <div className="mb-4">
                        <div className="flex items-end ">
                          <h4 className="text-lg font-medium mb-0 h-full">
                            Definition
                          </h4>
                        </div>
                        <div className=" mb-4">
                          {wordObj.definitions.definition}
                        </div>
                        <h4 className="text-lg font-medium mb-0.5">
                          {wordObj.partsOfSpeech.length > 1
                            ? "Ordklasser"
                            : "Ordklass"}
                        </h4>
                        <div className=" flex gap-1 mb-4">
                          {wordObj.partsOfSpeech.map((pos, idx) => (
                            <div className=" gap-2 mb-1" key={idx}>
                              <PartOfSpeech part={pos} />
                            </div>
                          ))}
                        </div>
                        <h4 className="text-lg font-medium mb-1">
                          Exempelmeningar
                        </h4>
                        <ul className="list-disc pl-4">
                          {wordObj.sentences.map((sentence, idx) => (
                            <li key={idx} className="mb-2">
                              <div className="inline  ">{sentence}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
      </div>
    </div>
  );
}
