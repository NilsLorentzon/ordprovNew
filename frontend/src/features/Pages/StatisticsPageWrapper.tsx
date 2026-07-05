import { axios } from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import CompletionCircle from "../../Components/CompletionCircle";
import React from "react";
import BaseModal from "../../Components/BaseModal";
import WordCardWrapper from "../../Components/WordCardWrapper";
import { round2 } from "../../utilities/utilities";
import { ChevronRight } from "lucide-react";
import BarGraph from "../../Components/BarGraph";
import BarGraphCopy from "../../Components/BarGraphCopy";
import CircleGraph from "../Statistics/CircleGraph";
import { AuthContext } from "../../providers/AuthenticationProvider";
import useLocalStorage from "../../hooks/useLocalStorage";
import type { Question } from "../../types/types";
import LockIcon from "../../assets/SVG/LockIcon";

interface Statistics {
  amountOfCorrectlyAnsweredWords: number;
  correctlyAnsweredWords: string[];
  totalAmountOfWords: number;
  lastInfinity: {
    correctAnswers: number;
    totalAnswers: number;
    answeredQuestions: {
      word: string;
      isCorrect: boolean;
      correctAnswer: string;
      userAnswer: string;
    }[];
  };
  knowledgeLevelStatistics: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
export default function StatisticsPageWrapper() {
  const { auth } = React.useContext(AuthContext);
  const value = useLocalStorage();
  const { data: statistics, isLoading: isStatisticsLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: (): Promise<Statistics> => {
      if (auth.email) {
        return axios.get(`statistics/`);
      } else {
        const allQuestions = value.storageData.questions.sort((a, b) => {
          return (
            new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
          );
        });
        const allQuestionsUniqueWordsHashmap = {} as Record<string, Question>;

        allQuestions.forEach((question) => {
          if (!allQuestionsUniqueWordsHashmap[question.word]) {
            allQuestionsUniqueWordsHashmap[question.word] = question;
          }
        });

        const uniqueWordsList = Object.values(allQuestionsUniqueWordsHashmap);
        const correctlyAnsweredWords = uniqueWordsList.filter(
          (q) => q.isCorrect,
        );
        const allWordsLength = 2060; // TODO

        const knowledgeLevelStatistics = {
          1: allWordsLength,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

        const statisticsData = {
          amountOfCorrectlyAnsweredWords: correctlyAnsweredWords.length,
          correctlyAnsweredWords: correctlyAnsweredWords.map((q) => q.word),
          totalAmountOfWords: allWordsLength,
          lastInfinity: {
            correctAnswers: allQuestions.filter((q) => q.isCorrect).length,
            totalAnswers: allQuestions.length,
            answeredQuestions: allQuestions
              .map((q) => ({
                word: q.word,
                isCorrect: q.isCorrect,
                correctAnswer: q.correctAnswer,
                userAnswer: q.answer,
              }))
              .slice(0, 100),
          },
          knowledgeLevelStatistics,
        };
        return new Promise((resolve) => {
          resolve(statisticsData);
        });
      }
    },
  });
  const [infoModal, setInfoModal] = React.useState(false);

  const [currentWordModal, setCurrentWordModal] = React.useState("");
  if (isStatisticsLoading || statistics === undefined) {
    return <div></div>;
  }
  return (
    <div className="lg:p-8  h-full ">
      <BaseModal
        isOpen={currentWordModal !== ""}
        setIsOpen={(value) => {
          if (value === false) {
            setCurrentWordModal("");
          }
        }}
        title={""}
      >
        <WordCardWrapper word={currentWordModal} />
      </BaseModal>
      <BaseModal
        isOpen={infoModal}
        setIsOpen={(value) => {
          if (value === false) {
            setInfoModal(false);
          }
        }}
        title={""}
      >
        <div className="h-full min-h-full text-lg">
          Kunskapsnivåerna mätter hur väl du kan ett ord baserat på hur många
          gånger du har svarat rätt respektive fel på det ordet. Ju högre nivå
          ett ord har, desto bättre kan du det. För att höja nivån på ett ord så
          behöver du svara rätt på det ordet på proven. Varje gång du svarar
          rätt så höjs nivån och beroende på provets svårighetsgrad så kan nivån
          höjas mer än 1 nivå.
          <br />
          <br />
          Det finns en brytpunkt på kunskapsnivå 3 där man måste köra svårare
          prov för att höja nivån. Då krävs det att man kör "skriva
          definitionen" varianten som kräver att du kan ordet utan ledtrådar.
          Det är ett bra sätt att utmana sig själv och verkligen lära sig orden
          på djupet. Om du endast vill klara högskoleprovet så räcker det att
          höja nivån på alla orden till 3 eller 4.
        </div>
      </BaseModal>
      <div className=" sm:p-4 pt-16 flex gap-8 flex-wrap">
        {/* <div className="">
          <BarGraphCopy />
        </div> */}
        <div className="p-4 sm:p-8 bg-white rounded-md  shadow-md border border-black/20 max-w-md sm:max-w-sm  w-full">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Kunskapsnivå för alla ord
          </h2>
          {auth.email ? (
            <div className="">
              {Object.keys(statistics.knowledgeLevelStatistics).map(
                (level: any) => {
                  const amountOfWordsOnThisLevel =
                    statistics.knowledgeLevelStatistics[
                      level as keyof typeof statistics.knowledgeLevelStatistics
                    ];
                  const percentage = round2(
                    (amountOfWordsOnThisLevel / statistics.totalAmountOfWords) *
                      100,
                  );
                  return (
                    <div className="flex items-center w-full mb-6" key={level}>
                      <div className="">
                        <h4 className="w-24 pr-4 leading-4 mt-2 text-lg ">
                          Nivå {level}
                        </h4>
                        <span className="text-xs leading-0 tracking-wider font-medium text-black/70">
                          {amountOfWordsOnThisLevel} /{" "}
                          {statistics.totalAmountOfWords}
                        </span>
                      </div>
                      <div className="w-full rounded-full overflow-hidden border border-black/30  ">
                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                          className="bg-[#10B981] h-4 rounded-md "
                        ></div>
                      </div>
                      <div className="pl-2 text-sm font-medium w-20 text-right text-p-200">{`${percentage}%`}</div>
                    </div>
                  );
                },
              )}
              <button
                className=" text-p-300  "
                onClick={() => setInfoModal(true)}
              >
                Läs mer om kunskapsnivåer{" "}
              </button>
            </div>
          ) : (
            <div className="text-lg mt-12">
              Logga in för att se denna statistik.
              <div className="flex w-full justify-center mt-4">
                <LockIcon className="w-12 h-12 fill-black" />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-8 bg-white rounded-md  shadow-md border border-black/20 max-w-md sm:max-w-sm  w-full">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Andel rätta svar
          </h2>
          <CircleGraph
            correct={statistics.lastInfinity.correctAnswers}
            wrong={
              statistics.lastInfinity.totalAnswers -
              statistics.lastInfinity.correctAnswers
            }
          />
          <div className="my-12"></div>
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Antal besvarade frågor
          </h2>
          {/* fontWeight="bold"
          fill="#374151" */}
          <div className="text-4xl pl-4 font-bold text-[#374151]">
            {statistics.lastInfinity.totalAnswers}
          </div>
        </div>
        <div className="p-4 sm:p-8 bg-white rounded-md  shadow-md border border-black/20 max-w-md sm:max-w-sm  w-full">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Senaste 100 orden
          </h2>
          <div className="w-full rounded-md border border-black/20  pr-1">
            <div className="overflow-auto max-h-70 h-full p-4 inset-shadow-sm">
              {statistics.lastInfinity.answeredQuestions.length === 0 ? (
                "Ingen data tillgänglig än, börja plugga!"
              ) : (
                <div className=" ">
                  <ul className=" list-inside">
                    {statistics.lastInfinity.answeredQuestions.map(
                      (wordObj, index) => (
                        <li
                          key={index}
                          className="lg:text-base text-xl mb-2 lg:mb-1 text-p-300"
                        >
                          <button
                            className=""
                            onClick={() => setCurrentWordModal(wordObj.word)}
                          >
                            {wordObj.word}
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {!auth.email && (
          <div className="p-4 sm:p-8 bg-white rounded-md  shadow-md border border-black/20 max-w-md sm:max-w-sm  w-full">
            <h2 className="text-2xl font-medium tracking-tight mb-2">
              Se mer statistik
            </h2>
            <h3 className="text-base tracking-wide">
              Ordprov sparar bara de första 100 orden du har svarat på när du
              inte inloggad. Logga in för att se all din statistik och få en
              bättre översikt över din utveckling!
            </h3>
            {!auth.email && (
              <div className="flex justify-end w-full">
                <button
                  aria-label="Skapa konto"
                  className="mt-8 px-6 py-3 bg-p-200 text-white text-2xl rounded-lg hover:bg-p-200 hover:scale-110 transition duration-300"
                  // onClick={() => navigate(routePaths.signup)}
                >
                  Skapa konto
                </button>
              </div>
            )}
          </div>
        )}

        {/* <div className="p-4 sm:p-8 bg-white rounded-md  shadow-md border border-black/20 max-w-md sm:max-w-sm  w-full">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Rätt svarade ord
          </h2>
          <div className="">
            <div className="w-full">
              <CompletionCircle
                currentAmount={statistics.amountOfCorrectlyAnsweredWords}
                totalAmount={statistics.totalAmountOfWords}
                colour="green"
              />
            </div>
            <div className="mt-4 w-full rounded-md border border-black/20  pr-1">
              <div className="overflow-auto max-h-70 h-full p-4 inset-shadow-sm">
                {statistics.correctlyAnsweredWords.length === 0 ? (
                  "Ingen data tillgänglig än, börja plugga!"
                ) : (
                  <div className=" ">
                    <ul className=" list-inside">
                      {statistics.correctlyAnsweredWords.map((word, index) => (
                        <li key={index} className="text-sm text-black">
                          <button
                            className=""
                            onClick={() => setCurrentWordModal(word)}
                          >
                            {word}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-8 w-full sm:border shadow-md border-black/20 max-w-xl rounded-md bg-white">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Senaste 100 frågorna
          </h2>
          <div className="w-full">
            <CompletionCircle
              currentAmount={statistics.last100.correctAnswers}
              totalAmount={statistics.last100.answeredQuestions.length}
              colour="green"
              showProcentage={true}
            />
          </div>
          <div className="mt-4">
            <div className=" w-full rounded-md border border-black/20  pr-1">
              <div className="overflow-auto max-h-70 h-full p-0.5 sm:p-4 inset-shadow-sm">
                {statistics.correctlyAnsweredWords.length === 0 ? (
                  "Ingen data tillgänglig än, börja plugga!"
                ) : (
                  <div className=" ">
                    <table className="table-auto w-full overflow-auto max-w-full">
                      <thead>
                        <tr className="">
                          <th className="text-left pl-1 font-medium text-xl">
                            Ord
                          </th>
                          <th className="text-left pl-1 font-medium text-xl">
                            Rätt svar
                          </th>
                          <th className="text-left pl-1 font-medium text-xl">
                            Ditt svar
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistics.last100.answeredQuestions.map(
                          (question, index) => (
                            <tr key={index} className="text-sm">
                              <td className="text-left pl-1 pb-1">
                                <button
                                  className=""
                                  onClick={() =>
                                    setCurrentWordModal(question.word)
                                  }
                                >
                                  {question.word}
                                </button>
                              </td>
                              <td className="text-left pl-1 pb-1">
                                {question.correctAnswer}
                              </td>
                              <td
                                className={clsx(
                                  "text-left pl-1 pb-1",
                                  question.isCorrect
                                    ? "text-green-500"
                                    : "text-red-500",
                                )}
                              >
                                {question.userAnswer}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
