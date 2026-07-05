import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckSmallIcon from "../../assets/SVG/CheckSmallIcon";
import CrossSmallIcon from "../../assets/SVG/CrossSmallIcon";
import ControlledTextArea from "../../Components/ControlledTextArea";
import { AuthContext } from "../../providers/AuthenticationProvider";
import type {
  WordDataQuizExtended,
  QuizTypes,
  LearningCardWithWord,
} from "../../types/types";
import { Button } from "../../Components/Button";
import { routePaths } from "../../routes/MainRoutes";
import { Menu, MenuItem, MenuTrigger } from "../../Components/Menu";
import CogIcon from "../../assets/SVG/CogIcon";
import ScrollButton from "../../Components/ScrollButton";
import CheckCircleIcon from "../../assets/SVG/CheckCircleIcon";
import CheckSmallAnimateIcon from "../../assets/SVG/CheckSmallAnimateIcon";
import useLocalStorage from "../../hooks/useLocalStorage";
import { axios } from "../../lib/axios";
import { PartOfSpeech } from "../Quiz/Quiz";
import ScrollArrowIcon from "../../assets/SVG/ScrollArrowIcon";
import { useHotkeys } from "@tanstack/react-hotkeys";
// import CogIcon from "./assets/SVG/CogIcon";

interface QuizProps {
  words: LearningCardWithWord[];
  setWords: React.Dispatch<React.SetStateAction<LearningCardWithWord[]>>;
  refetchWordData: () => void;
}

interface LearningAnswer {
  word: string;
  answer: "1" | "2" | "3" | "4";
}

function LearningPage({ words, refetchWordData, setWords }: QuizProps) {
  // const value = useLocalStorage();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const amountOfQuestions = words.length;
  const { auth } = useContext(AuthContext);
  const storageData = useLocalStorage();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useHotkeys([
    { hotkey: "1", callback: () => handleKeyAction("1") },
    { hotkey: "2", callback: () => handleKeyAction("2") },
    { hotkey: "3", callback: () => handleKeyAction("3") },
    { hotkey: "4", callback: () => handleKeyAction("4") },
    { hotkey: "Space", callback: () => handleKeyAction("Space") },
    { hotkey: "S", callback: () => handleKeyAction("S") },
  ]);

  const handleAnswer = (answer: "1" | "2" | "3" | "4") => {
    const currentWord = words[currentWordIndex];
    sendLearningAnswer({
      word: currentWord.word,
      answer,
    });
    setShowInfo(false);
    // if  "1" or "2" then copy the current word to the end of the array
    if (answer === "1" || answer === "2") {
      setWords((prev) => [...prev, currentWord]);
    }
    setCurrentWordIndex((prev) => prev + 1);
  };

  const handleKeyAction = (key: string) => {
    if (key === "Space") {
      setShowInfo((prev) => !prev);
    } else if (["1", "2", "3", "4"].includes(key)) {
      if (showInfo) {
        handleAnswer(key as "1" | "2" | "3" | "4");
      }
    } else if (key === "S") {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        const maxScroll = mainContent.scrollHeight - mainContent.clientHeight;
        const isAtBottomHalf = mainContent.scrollTop > maxScroll / 2;
        if (isAtBottomHalf) {
          mainContent.scrollTo({ top: 0, behavior: "smooth" });
          setScrollDirection("up");
        } else {
          mainContent.scrollTo({ top: maxScroll, behavior: "smooth" });
          setScrollDirection("down");
        }
      }
    }
  };

  const sendLearningAnswerMutation = useMutation(
    ["learning", "post"],
    (learningAnswer: LearningAnswer) => {
      return axios.post(`learning/card`, learningAnswer);
    },
    {
      onSuccess: () => {},
    },
  );

  const sendLearningAnswer = (learningAnswer: LearningAnswer) => {
    // if (!auth.email) {
    //   storageData.setNewQuestion({
    //     ...learningAnswer,
    //   });
    // }
    sendLearningAnswerMutation.mutate(learningAnswer);
  };

  const currentWord = words[currentWordIndex];

  // const lastAnsweredIndexWriteDefinition = words.findLastIndex(
  //   (word) => word.wordData.writenDefinitionSubmited,
  // );
  // const lastAnsweredIndex = lastAnsweredIndexWriteDefinition;

  // const isAnsweredFunction = (word: LearningCardWithWord) => {
  //   return word.wordData.writenDefinitionSubmited;
  // };
  // const isCorrectAnswerFunction = (word: LearningCardWithWord) => {
  //   return word.wordData.writenDefinitionIsCorrect;
  // };

  console.log("currentWordIndex", currentWordIndex);

  if (currentWord === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 mb-4 mx-auto text-green-500" />
          <h2 className="text-2xl font-bold mb-2">Bra jobbat!</h2>
          <p className="text-gray-700 mb-4">Du har gått igenom alla ord.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-full">
      <div className="m-auto md:p-8 md:pt-8 pt-18 py-2 max-w-3xl relative min-h-screen px-2">
        {
          <div
            key={currentWord.word}
            className="mb-8 border-black/20 border rounded-md bg-white p-4 md:shadow-md min-h-80"
          >
            <div className="">
              <div className="flex items-top justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl mb-0">
                    {/* <span className=" text-xl ">{index + 1}. </span> */}
                    <span>{currentWord.word}</span>
                  </h2>
                </div>

                <div className="">
                  <MenuTrigger>
                    <Button aria-label="Actions" variant="quiet">
                      <MoreVertical className="w-5 h-5 stroke-black " />
                    </Button>
                    <Menu className="bg-amber-300">
                      <MenuItem
                        onAction={() => {
                          window.open(
                            `${routePaths.ordlista}/${currentWord.word}`,
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
              <AnimatePresence>
                {showInfo && (
                  <motion.div>
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
                          {currentWord.wordData.definitions.definition}
                        </div>

                        <h4 className="text-lg font-medium mb-0.5">
                          {currentWord.wordData.partsOfSpeech.length > 1
                            ? "Ordklasser"
                            : "Ordklass"}
                        </h4>
                        <div className=" flex gap-1 mb-4">
                          {currentWord.wordData.partsOfSpeech.map(
                            (pos, idx) => (
                              <div className=" gap-2 mb-1" key={idx}>
                                <PartOfSpeech part={pos} />
                              </div>
                            ),
                          )}
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
                          {currentWord.wordData.sentences.map(
                            (sentence, idx) => (
                              <li key={idx} className="mb-2">
                                <div className="inline  ">{sentence}</div>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        }
        {
          <div className="fixed w-full bottom-0 left-0 right-0 z-20">
            <div className="flex">
              <div className="md:w-60 md:min-w-60"></div>
              <div className="w-full">
                <div className="m-auto  max-w-md w-full md:max-w-lg p-4 text-center text-white sm:rounded-md bg-gray-950/40 backdrop-blur-[1px] sm:backdrop-blur-none  pb-8 sm:pb-4 sm:bg-gray-950/0">
                  {showInfo ? (
                    <div className="flex justify-between">
                      <button
                        onClick={() => {
                          handleAnswer("1");
                        }}
                        className="bg-p-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-black border-2 px-4 p-3 w-18 md:w-26 flex items-center justify-center text-nowrap"
                      >
                        Blankt{" "}
                        <span className="hidden md:flex ml-2 rounded-sm p-0.5 justify-center items-center bg-gray-700 border-1 border-black min-h-6 min-w-6 text-xs">
                          1
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          handleAnswer("2");
                        }}
                        className="bg-p-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-black border-2 px-4 p-3 w-18 md:w-26 flex items-center justify-center"
                      >
                        Svårt{" "}
                        <span className="hidden md:flex ml-2 rounded-sm p-0.5 justify-center items-center bg-gray-700 border-1 border-black min-h-6 min-w-6 text-xs">
                          2
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          handleAnswer("3");
                        }}
                        className="bg-p-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-black border-2 px-4 p-3 w-18 md:w-26 flex items-center justify-center"
                      >
                        Okej{" "}
                        <span className="hidden md:flex ml-2 rounded-sm p-0.5 justify-center items-center bg-gray-700 border-1 border-black min-h-6 min-w-6 text-xs">
                          3
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          handleAnswer("4");
                        }}
                        className="bg-p-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border-black border-2 px-4 p-3 w-18 md:w-26 flex items-center justify-center"
                      >
                        Enkelt{" "}
                        <span className="hidden md:flex ml-2 rounded-sm p-0.5 justify-center items-center bg-gray-700 border-1 border-black min-h-6 min-w-6 text-xs">
                          4
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setShowInfo(true)}
                        className="bg-p-100 rounded-xl border-black border-2 px-4 p-3 w-full flex items-center justify-center text-nowrap"
                      >
                        Visa svar{" "}
                        <span className="hidden md:flex ml-2 rounded-sm p-0.5 px-2 justify-center items-center bg-gray-700 border-1 border-black min-h-6 min-w-6 text-xs">
                          space
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
        {/* <div className="fixed xl:block hidden bottom-4 right-8 z-20 ">
          <button className="flex items-center justify-center bg-p-100 rounded-full w-36 text-white border-2 border-black">
            <motion.div
              transition={{ duration: 1.5, repeat: Infinity }}
              className="  w-12 h-12 flex justify-center items-center"
            >
              <div className="p-4 ">
                <ScrollArrowIcon
                  className={clsx(
                    "fill-white w-8 h-8",
                    scrollDirection === "down" ? "rotate-180" : "",
                  )}
                />
              </div>
            </motion.div>
            <span className="hidden md:flex ml-2 rounded-sm p-0.5 px-2 justify-center items-center bg-gray-700 border-1 border-black min-h-6 min-w-6 text-xs">
              S
            </span>
          </button>
        </div> */}
      </div>
      <div className="pb-16"></div>
    </div>
  );
}

export default LearningPage;
