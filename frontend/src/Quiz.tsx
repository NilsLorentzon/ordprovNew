import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";
// import CogIcon from "./assets/SVG/CogIcon";
import { MenuTrigger, Menu, MenuItem } from "./Components/Menu.tsx";
import { Button } from "./Components/Button.tsx";
import { MoreVertical } from "lucide-react";
// import CheckCircleIcon from "./assets/SVG/CheckCircleIcon.tsx";
import { useMutation } from "@tanstack/react-query";
import { axios } from "./lib/axios.ts";
import { queryClient } from "./lib/react-query.ts";
import SpeakerIcon from "./assets/SVG/SpeakerIcon.tsx";
// import PlusIcon from "./assets/SVG/PlusIcon.tsx";
// import BookmarkIcon from "./assets/SVG/BookmarkIcon.tsx";
import { AuthContext } from "./providers/AuthenticationProvider.tsx";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { routePaths } from "./routes/MainRoutes.tsx";
import type {
  QuizTypes,
  WordDataQuiz,
  WordDataQuizExtended,
} from "./types/types.ts";
import CogIcon from "./assets/SVG/CogIcon.tsx";
import ControlledTextArea from "./Components/ControlledTextArea.tsx";
import CheckSmallIcon from "./assets/SVG/CheckSmallIcon.tsx";
import CrossSmallIcon from "./assets/SVG/CrossSmallIcon.tsx";

interface QuizProps {
  words: WordDataQuizExtended[];
  setWords: React.Dispatch<React.SetStateAction<WordDataQuizExtended[]>>;
  // repetitions: Repetition[];
  refetchWordData: () => void;
  updateQuizId: () => void;
  amountOfQuestions: number;
  quizType: QuizTypes;
}

interface QuestionAnswer {
  word: string;
  alternativeWords: { word: string; definition: string }[];
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  generatedTime: Date;
  answeredTime: Date;
}

function Quiz({
  words,
  refetchWordData,
  setWords,
  updateQuizId,
  amountOfQuestions,
  quizType,
}: QuizProps) {
  const { auth } = useContext(AuthContext);
  // const updateMutation = useMutation(
  //   ["currentWord"],
  //   (wordData: WordDataQuizExtended) => {
  //     return axios.put(`wiki/generate`, wordData);
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(["words"]);
  //     },
  //   },
  // );
  const navigate = useNavigate();

  const sendQuizAnswerMutation = useMutation(
    ["quiz", "answer"],
    (questionAnswer: QuestionAnswer) => {
      return axios.post(`answer`, questionAnswer);
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
  // const repetitionUpdateMutation = useMutation(
  //   ["repetitions", "word"],
  //   ({
  //     repetition,
  //     isBookmarked,
  //   }: {
  //     repetition: string;
  //     isBookmarked: boolean;
  //   }) => {
  //     return axios.post(`repetition/word`, { word: repetition, isBookmarked });
  //   },
  //   {
  //     onSuccess: () => {
  //       // queryClient.invalidateQueries(["repetitions"]);
  //       queryClient.invalidateQueries({
  //         queryKey: ["repetitions"],
  //       });
  //     },
  //   },
  // );
  // conver number to array with that many elements, for example 5 to [1, 2, 3, 4, 5]
  // const numberArray = Array.from({ length: parseInt(amountOfQuestions) }, (_, i) => i + 1);
  const restartQuiz = () => {
    setWords([]);
    updateQuizId();
    refetchWordData();
    // find main-content id and scroll to top
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };
  const lastAnsweredIndexMultipleChoice = words.findLastIndex(
    (word) => word.answer !== "",
  );
  const lastAnsweredIndexWriteDefinition = words.findLastIndex(
    (word) => word.writenDefinitionSubmited,
  );
  const lastAnsweredIndex =
    quizType === "multipleChoice"
      ? lastAnsweredIndexMultipleChoice
      : lastAnsweredIndexWriteDefinition;
  return (
    <div className="m-auto md:p-8 md:pt-18 pt-18 py-2 max-w-3xl relative">
      <div className="pl-6 mt-2">
        <h1 className="text-2xl font-bold mb-2">Prov</h1>
        {quizType === "multipleChoice" && (
          <p className="text-md text-black tracking-wide mb-4">
            Välj rätt definition för alla {words.length} orden. Lycka till!
          </p>
        )}
        {quizType === "writeDefinition" && (
          <p className="text-md text-black tracking-wide mb-4">
            Skriv ner en definition för varje ord eller fundera på vad det kan
            betyda. När du är klar kan du jämföra ditt svar med den korrekta
            definitionen. Bedöm sedan själv om du hade rätt eller fel. Lycka
            till!
          </p>
        )}
      </div>
      {words
        .map((wordObj, index) => {
          // const rightAnswer = wordObj.answer === wordObj.correctAnswer;
          const wrongAnswer =
            wordObj.answer !== "" && wordObj.answer !== wordObj.correctAnswer;
          // const isBookmarked = repetitions.some(
          //   (rep) => rep.word === wordObj.word,
          // );
          return (
            <div
              key={wordObj.word}
              className="mb-8 border-black/20 border rounded-md bg-white p-4 md:shadow-md"
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
                  )} */}
                    {/* <button className="p-1" aria-label="Lyssna på ordet">
                    <SpeakerIcon className="w-5 h-5 fill-white hover:scale-125" />
                  </button> */}
                    <MenuTrigger>
                      <Button aria-label="Actions" variant="quiet">
                        <MoreVertical className="w-5 h-5 stroke-black " />
                      </Button>
                      <Menu className="bg-amber-300">
                        {/* <MenuItem onAction={() => alert("rename")}>
                        <div className="flex justify-between items-center w-full">
                          Inställningar{" "}
                          <CogIcon className="w-5 h-5 fill-white" />
                        </div>
                      </MenuItem> */}
                        <MenuItem
                          onAction={() => {
                            // alert("open")
                            window.open(
                              `${routePaths.ordlista}/${wordObj.word}`,
                              "_blank",
                            );
                            // navigate(`${routePaths.ordlista}/${wordObj.word}`);
                          }}
                        >
                          Öppna i ordlista
                          {/* <Link
                          to={`${routePaths.ordlista}/${wordObj.word}`}
                          target="_blank"
                          className="w-full h-full"
                        >
                          <div className="">Öppna i ordlista</div>
                        </Link> */}
                        </MenuItem>
                        <MenuItem
                          onAction={() => {
                            // open new tab with url `${routePaths.report}?word=${wordObj.word}`
                            // navigate(
                            //   `${routePaths.report}?word=${wordObj.word}`,
                            // );
                            window.open(`${routePaths.report}`, "_blank");
                          }}
                        >
                          Anmäl felaktig information
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
                {quizType === "multipleChoice" && (
                  <div className="pl-0">
                    <ul className="">
                      {wordObj.alternatives.map((alternative, idx) => (
                        <li key={idx}>
                          <button
                            aria-label={`Välj alternativ: ${alternative.definition}`}
                            className={clsx(
                              "px-4 py-2 border-black/40 border bg-gray-200 w-full tracking-wide text-left mb-2 rounded-md   disabled:scale-100 transition duration-200",
                              wordObj.answer === "" &&
                                "hover:bg-p-900 hover:shadow-md",
                              wordObj.answer !== "" &&
                                wordObj.correctAnswer ===
                                  alternative.definition &&
                                "bg-green-200",
                              wrongAnswer &&
                                wordObj.answer === alternative.definition &&
                                "bg-red-200",
                            )}
                            onClick={() => {
                              if (wordObj.answer !== "") return;
                              wordObj.answer = alternative.definition;
                              setWords([...words]);

                              if (auth.email) {
                                sendQuizAnswerMutation.mutate({
                                  word: wordObj.word,
                                  alternativeWords: wordObj.alternatives,
                                  answer: alternative.definition,
                                  correctAnswer: wordObj.correctAnswer,
                                  isCorrect:
                                    alternative.definition ===
                                    wordObj.correctAnswer,
                                  generatedTime: wordObj.generatedTime,
                                  answeredTime: new Date(),
                                });
                              }
                            }}
                            disabled={wordObj.answer !== ""}
                          >
                            <div className="flex justify-between">
                              <span className="">
                                {alternative.definition}{" "}
                              </span>
                              {/* <div className="">
                            {wordObj.answer !== "" &&
                              wrongAnswer &&
                              wordObj.correctAnswer ===
                                alternative.definition && (
                                <div className="">
                                  <CheckCircleIcon className="h-7 w-7 fill-green-600" />
                                </div>
                              )}
                          </div> */}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {quizType === "writeDefinition" && (
                  <div className="">
                    <ControlledTextArea
                      // label="Skriv din definition här"
                      value={wordObj.writenDefinitionText}
                      onChange={(value) => {
                        wordObj.writenDefinitionText = value;
                        setWords([...words]);
                      }}
                    />

                    {!wordObj.showDefinition && (
                      <div className="flex justify-end mt-4 gap-1">
                        <button
                          className="bg-p-100 ml-2 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                          onClick={() => {
                            if (wordObj.writenDefinitionSubmited) return;
                            wordObj.showDefinition = true;
                            setWords([...words]);
                          }}
                        >
                          Visa definition
                        </button>
                      </div>
                    )}
                    {wordObj.showDefinition && (
                      <div className="mt-4">
                        <h4 className="">
                          Jämför med den korrekta definitionen och bedöm sedan
                          själv om du hade rätt eller fel. Klicka på bocken om
                          du hade tillräckligt bra koll på ordet och krysset om
                          du inte hade det.
                        </h4>
                        <div className="flex gap-1 mt-2 justify-end">
                          <button
                            className={clsx(
                              "border-2 h-12 w-12 flex  justify-center items-center border-black bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ",
                              wordObj.writenDefinitionSubmited &&
                                wordObj.writenDefinitionIsCorrect &&
                                "opacity-50 cursor-not-allowed",
                            )}
                            onClick={() => {
                              if (wordObj.writenDefinitionSubmited) return;
                              wordObj.writenDefinitionSubmited = true;
                              wordObj.writenDefinitionIsCorrect = false;
                              wordObj.showDefinition = true;
                              setWords([...words]);
                            }}
                            disabled={wordObj.writenDefinitionSubmited}
                          >
                            <CrossSmallIcon className="min-w-6 min-h-6 fill-white" />
                          </button>
                          <button
                            className={clsx(
                              "border-2 h-12 w-12 flex  justify-center items-center border-black bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ",
                              wordObj.writenDefinitionSubmited &&
                                !wordObj.writenDefinitionIsCorrect &&
                                "opacity-50 cursor-not-allowed",
                            )}
                            onClick={() => {
                              if (wordObj.writenDefinitionSubmited) return;
                              wordObj.writenDefinitionSubmited = true;
                              wordObj.writenDefinitionIsCorrect = true;
                              wordObj.showDefinition = true;
                              setWords([...words]);
                            }}
                            disabled={wordObj.writenDefinitionSubmited}
                          >
                            <CheckSmallIcon className="min-w-6 min-h-6 fill-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <AnimatePresence>
                  {(quizType === "multipleChoice" && wordObj.answer !== "") ||
                    (quizType === "writeDefinition" &&
                      wordObj.showDefinition && (
                        <motion.div
                          initial={{ opacity: 1, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto", // Automatically calculates the full content height
                            transition: { duration: 0.5, ease: "easeIn" }, // "slowly" expand
                          }}
                          style={{ overflow: "hidden" }} // Crucial to hide content while expanding
                          // exit={{ opacity: 0, height: 0 }}
                        >
                          <div
                            className={clsx(
                              " border-0  rounded-md",
                              wordObj.showInfo
                                ? "border-p-200/40 p-2"
                                : " p-2 pt-2 pb-0 border-p-200/0",
                            )}
                          >
                            <div className="mb-4">
                              <div className="flex items-end ">
                                <h4 className="text-lg font-medium mb-0 h-full">
                                  Definition av{" "}
                                  <span className="">{wordObj.word}</span>
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
                              <div
                                className="opacity-0 h-0 w-0 p-0 m-0"
                                tabIndex={0}
                                // aria-label="this div is used for tab navigation, no other purpose"
                              ></div>
                              <ul className="list-disc pl-4">
                                {wordObj.sentences.map((sentence, idx) => (
                                  <li key={idx} className="mb-2">
                                    <div className="inline  ">{sentence}</div>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* <div
                        className={clsx(
                          "flex justify-end ",
                          wordObj.showInfo ? "mr-0" : "-mr-4",
                        )}
                      >
                        <button
                          id={`${wordObj.word}`}
                          aria-label={
                            wordObj.showInfo
                              ? "Dölj information"
                              : "Visa mer information"
                          }
                          className="bg-p-100 text-white rounded-md px-3  py-1"
                          onClick={() => {
                            wordObj.showInfo = !wordObj.showInfo;
                            setWords([...words]);
                          }}
                        >
                          Läs {wordObj.showInfo ? "mindre" : "mer"}{" "}
                          {wordObj.showInfo ? (
                            <MinusIcon className="w-4 h-4 fill-white inline-block ml-1" />
                          ) : (
                            <PlusIcon className="w-4 h-4 fill-white inline-block ml-1" />
                          )}
                        </button>
                      </div> */}
                          </div>
                        </motion.div>
                      ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })
        .filter(
          (wordObj, index) => index <= lastAnsweredIndex + 1 || index === 0,
        )}
      <div className="fixed top-16 md:top-4  right-2 md:right-8 z-20">
        <div className=" bg-p-200 p-1.5 py-1 rounded-md">
          <div className="flex items-center gap-0 ">
            <div className="w-48 md:w-48 rounded-full flex overflow-clip border-2 border-black bg-p-100">
              {Array.from({ length: amountOfQuestions }, (_, i) => i + 1).map(
                (num, index) => {
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "bg-p-100  border-p-100 relative box-border",
                        index !== amountOfQuestions - 1 && "border-r-2",
                      )}
                      style={{
                        width: `${Math.ceil(100 / amountOfQuestions)}%`,
                      }}
                    >
                      <div
                        key={num}
                        className={clsx(
                          " h-2 transition-all duration-500 ",
                          words[index].answer === "" && "bg-p-100",
                          words[index].answer === "" &&
                            lastAnsweredIndex > index &&
                            " border-gray-300",
                          words[index].answer === words[index].correctAnswer &&
                            "bg-green-400",
                          words[index].answer !== "" &&
                            words[index].answer !==
                              words[index].correctAnswer &&
                            "bg-red-400",
                          // words[index].answer !== "" &&
                          //   index !== 0 &&
                          //   // box box
                          //   "border-l-3 border-p-100 ",
                        )}
                        style={{
                          // width: `${(words.filter((word) => word.answer !== "").length / words.length) * 10}%`,
                          width: lastAnsweredIndex >= index ? `100%` : "0%",
                        }}
                      >
                        {" "}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
            <div className="tracking-widest w-12 text-white text-sm font-medium text-right">
              {words.filter((word) => word.answer !== "").length}/
              {amountOfQuestions}
            </div>
          </div>
        </div>
        {words.filter((word) => word.answer !== "").length ===
          amountOfQuestions && (
          <div className="flex gap-2 w-full ">
            {/* <div className="text-lg flex items-center text-nowrap text-gray-200  font-medium tracking-widest rounded-md bg-p-200 px-2 py-1 mt-2">
            {words.filter((word) => word.answer === word.correctAnswer).length}/
            {words.length} Rätt
          </div> */}
            <div className="w-full flex items-start gap-2">
              <button
                onClick={() => {
                  navigate(`${routePaths.prov}`);
                }}
                className="h-12 w-12 min-w-12 mt-2 p-2 flex items-center justify-center bg-p-100 text-white rounded-md hover:bg-p-200 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <CogIcon className="w-6 h-6 fill-white" />
              </button>
              <button
                onClick={restartQuiz}
                className=" text-lg h-12 w-full text-white  font-medium tracking-wide rounded-md bg-p-100 hover:bg-p-200 transition px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Nytt prov
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PartOfSpeech({ part }: { part: string }) {
  const colors: Record<string, string> = {
    verb: "bg-blue-100 text-blue-800",
    adjektiv: "bg-pink-100 text-pink-800",
    substantiv: "bg-yellow-100 text-yellow-800",
    adverb: "bg-purple-100 text-purple-800",
    default: "bg-gray-100 text-gray-800",
  };
  // const colors: Record<string, string> = {
  //   verb: "bg-blue-100 text-blue-800",
  //   adjektiv: "bg-pink-100 text-pink-800",
  //   substantiv: "bg-yellow-100 text-yellow-800",
  //   adverb: "bg-purple-100 text-purple-800",
  //   default: "bg-gray-100 text-gray-800",
  // };
  const colorClass = colors[part] || colors["default"];
  return (
    <span
      className={`inline-block border-2 border-black/30 px-2 py-1 text-sm font-medium shadow-md rounded ${colorClass}`}
    >
      {part}
    </span>
  );
}

export default Quiz;
