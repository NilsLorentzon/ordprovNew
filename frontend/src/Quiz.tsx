import clsx from "clsx";
import { useState } from "react";
import CogIcon from "./assets/SVG/CogIcon";
import InfoIcon from "./assets/SVG/InfoIcon";
import MoreDots from "./assets/SVG/MoreDots";
import {
  MenuTrigger,
  SubmenuTrigger,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
} from "./Components/Menu.tsx";
import { Button } from "./Components/Button.tsx";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import CheckCircleIcon from "./assets/SVG/CheckCircleIcon.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "./lib/axios.ts";
import type { WordDataQuiz } from "./QuizWrapper.tsx";
import { queryClient } from "./lib/react-query.ts";
import SpeakerIcon from "./assets/SVG/SpeakerIcon.tsx";
import AudioRecorder from "./features/AudioRecorder.tsx";

interface WordDataQuizExtended extends WordDataQuiz {
  correctAnswer: string;
  answer: string;
  generatedTime: Date;
  answeredTime: Date;
}

interface QuizProps {
  wordData: WordDataQuiz[];
}

interface QuestionAnswer {
  word: string;
  alternativeWords: string[];
  answer: string;
  isCorrect: boolean;
  generatedTime: Date;
  answeredTime: Date;
}

function Quiz({ wordData }: QuizProps) {
  const updateMutation = useMutation(
    ["currentWord"],
    (wordData: WordDataQuizExtended) => {
      return axios.put(`wiki/generate`, wordData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["words"]);
      },
    },
  );

  const sendQuizAnswerMutation = useMutation(
    ["quiz", "answer"],
    (questionAnswer: QuestionAnswer) => {
      return axios.post(`question/question`, questionAnswer);
    },
    {
      onSuccess: () => {},
    },
  );
  const generateWordData = (wordData: WordDataQuizExtended) => {
    updateMutation.mutate(wordData);
  };
  const currentTime = new Date();

  const [words, setWords] = useState<WordDataQuizExtended[]>(
    wordData.map((wordObj) => ({
      ...wordObj,
      answer: "",
      correctAnswer: wordObj.definitions.shortDefinition,
      generatedTime: currentTime,
      answeredTime: currentTime,
    })),
  );

  return (
    <div className=" md:p-8 pt-8 p-2 max-w-3xl">
      {/* <div className="flex bg-p-300 p-1 justify-between items-center">
        <div className="text-white font-bold text-xl font-mono tracking-tighter">1/10</div>
        <CogIcon className="w-8 h-8 fill-white stroke-3" />
      </div> */}
      {words.map((wordObj, index) => {
        const rightAnswer = wordObj.answer === wordObj.correctAnswer;
        const wrongAnswer =
          wordObj.answer !== "" && wordObj.answer !== wordObj.correctAnswer;
        return (
          <div
            key={wordObj.word}
            className="mb-8 border-p-200/80 border-2 rounded-md bg-white p-4 md:shadow-md"
          >
            <div className="">
              <div className="flex items-top justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl mb-0">
                    <span className=" text-xl ">{index + 1}. </span>
                    <span>{wordObj.word}</span>
                  </h2>
                </div>

                <div className="">
                  <button className="p-1">
                    <SpeakerIcon className="w-5 h-5 fill-white " />
                  </button>
                  <MenuTrigger>
                    <Button aria-label="Actions" variant="quiet">
                      <MoreVertical className="w-5 h-5 stroke-black" />
                    </Button>
                    <Menu className="bg-amber-300">
                      <MenuItem onAction={() => alert("rename")}>
                        <div className="flex justify-between items-center w-full">
                          Inställningar{" "}
                          <CogIcon className="w-5 h-5 fill-white" />
                        </div>
                      </MenuItem>
                      <MenuItem onAction={() => alert("open")}>
                        <div className="">Öppna i ordlista</div>
                      </MenuItem>
                      <MenuItem onAction={() => alert("delete")}>
                        <div className="">Anmäl felaktig information</div>
                      </MenuItem>
                      {/* <SubmenuTrigger>
                      <MenuItem>Share</MenuItem>
                      <Menu>
                        <MenuItem>Email</MenuItem>
                        <MenuItem>SMS</MenuItem>
                        <MenuItem>Instagram</MenuItem>
                      </Menu>
                    </SubmenuTrigger> */}
                      {/* <MenuSeparator /> */}
                      {/* <MenuSection
                      selectionMode="multiple"
                      defaultSelectedKeys={["files"]}
                    >
                      <MenuItem id="files">Show files</MenuItem>
                      <MenuItem id="folders">Show folders</MenuItem>
                    </MenuSection> */}
                    </Menu>
                  </MenuTrigger>
                </div>
              </div>
              {/* <AudioRecorder /> */}
              <div className="pl-0">
                <ul className="">
                  {wordObj.alternatives.map((alternative, idx) => (
                    <li key={idx}>
                      <button
                        className={clsx(
                          "px-4 py-2 border-black/70 border bg-gray-100 w-full tracking-wide text-left mb-2 rounded-md hover:scale-[102%] disabled:scale-100 transition duration-200",
                          rightAnswer &&
                            wordObj.answer === alternative &&
                            "bg-green-200",
                          wrongAnswer &&
                            wordObj.answer === alternative &&
                            "bg-red-200",
                        )}
                        onClick={() => {
                          if (wordObj.answer !== "") return;
                          wordObj.answer = alternative;
                          setWords([...words]);
                          sendQuizAnswerMutation.mutate({
                            word: wordObj.word,
                            alternativeWords: wordObj.alternatives,
                            answer: alternative,
                            isCorrect: alternative === wordObj.correctAnswer,
                            generatedTime: wordObj.generatedTime,
                            answeredTime: new Date(),
                          });
                        }}
                        disabled={wordObj.answer !== ""}
                      >
                        <div className="flex justify-between">
                          <span className="">{alternative}</span>
                          <div className="">
                            {wordObj.answer !== "" &&
                              wrongAnswer &&
                              wordObj.correctAnswer === alternative && (
                                <CheckCircleIcon className="h-7 w-7 fill-green-600" />
                              )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {wordObj.answer !== "" && (
                <div className="">
                  {/* <hr className="border-b-1 border-black/70 my-2 -mx-1" /> */}
                  {/* {rightAnswer && (
                    <div className="text-green-700 text-xl font-medium">
                      Korrekt!
                    </div>
                  )} */}

                  <div className="mb-4">
                    <div className="flex items-end ">
                      <h4 className="text-lg font-medium mb-0 h-full">
                        Definition
                      </h4>
                      {/* {wordObj.partsOfSpeech[wordObj.currentPartOfSpeechIndex]
                        .definitions.length > 1 && (
                        <div className="ml-2 flex items-center gap-1">
                          {wordObj.partsOfSpeech[
                            wordObj.currentPartOfSpeechIndex
                          ].definitions.map((def, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                wordObj.currentDefinitionIndex = idx;
                                setWords([...words]);
                              }}
                              disabled={idx === wordObj.currentDefinitionIndex}
                              className={clsx(
                                "text-sm text-gray-800 border-2 border-black h-6 w-6 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-p-300/80 focus:ring-offset-2",
                                idx === wordObj.currentDefinitionIndex
                                  ? "bg-p-100 text-white"
                                  : "hover:bg-p-100 hover:text-white ",
                              )}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      )} */}
                    </div>
                    <div className=" mb-4">
                      {/* {
                        wordObj.partsOfSpeech[wordObj.currentPartOfSpeechIndex]
                          .definitions[wordObj.currentDefinitionIndex]
                          .shortDefinition
                      }
                      ,{" "}
                      {
                        wordObj.partsOfSpeech[wordObj.currentPartOfSpeechIndex]
                          .definitions[wordObj.currentDefinitionIndex]
                          .wikiDefinition
                      } */}
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
                          {/* {wordObj.partsOfSpeech.length > 1 && (
                            <button
                              onClick={() => {
                                wordObj.currentPartOfSpeechIndex = idx;
                                wordObj.currentDefinitionIndex = 0;
                                setWords([...words]);
                              }}
                              disabled={
                                idx === wordObj.currentPartOfSpeechIndex
                              }
                              className={clsx(
                                "text-sm text-gray-800 border-2 border-black h-6 w-6 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-p-300/80 focus:ring-offset-2",
                                idx === wordObj.currentPartOfSpeechIndex
                                  ? "bg-p-100 text-white"
                                  : "hover:bg-p-100 hover:text-white ",
                              )}
                            >
                              {idx + 1}
                            </button>
                          )} */}
                          <PartOfSpeech part={pos} />
                        </div>
                      ))}
                    </div>
                    {/* <button
                      onClick={() => generateWordData(wordObj)}
                      className="bg-p-100 text-white px-4 py-2 rounded-md"
                    >
                      Generate
                    </button> */}
                    <h4 className="text-lg font-medium mb-1">
                      Exempelmeningar
                    </h4>
                    <ul className="list-decimal pl-6">
                      {wordObj.sentences.map((sentence, idx) => (
                        <li key={idx} className="mb-1">
                          <div className="inline">{sentence}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PartOfSpeech({ part }: { part: string }) {
  const colors: Record<string, string> = {
    verb: "bg-blue-200 text-blue-800",
    adjektiv: "bg-pink-200 text-pink-800",
    substantiv: "bg-yellow-200 text-yellow-800",
    adverb: "bg-purple-200 text-purple-800",
    default: "bg-gray-200 text-gray-800",
  };
  const colorClass = colors[part] || colors["default"];
  return (
    <span
      className={`inline-block border-2 border-black/20 px-2 py-1 text-sm font-medium shadow-md rounded ${colorClass}`}
    >
      {part}
    </span>
  );
}

export default Quiz;
