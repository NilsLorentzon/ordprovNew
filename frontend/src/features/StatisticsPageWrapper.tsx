import { axios } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import CompletionCircle from "../Components/CompletionCircle";
import React from "react";
import BaseModal from "../Components/BaseModal";
import WordCardWrapper from "../Components/WordCardWrapper";

interface Statistics {
  amountOfCorrectlyAnsweredWords: number;
  correctlyAnsweredWords: string[];
  totalAmountOfWords: number;
  last100: {
    correctAnswers: number;
    answeredQuestions: {
      word: string;
      isCorrect: boolean;
      correctAnswer: string;
      userAnswer: string;
    }[];
  };
}
export default function StatisticsPageWrapper() {
  const { data: statistics, isLoading: isStatisticsLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: (): Promise<Statistics> => axios.get(`statistics/`),
  });

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
      <div className=" sm:p-4 pt-16 flex gap-8 flex-wrap">
        <div className="p-4 sm:p-8 bg-white rounded-md  shadow-md border border-black/20 max-w-md sm:max-w-sm  w-full">
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
                  "Du har inte rättat några ord än, fortsätt plugga!"
                ) : (
                  <div className=" ">
                    {/* <h3 className="text-lg font-medium tracking-tight mt-4 mb-2">
                      Rätt svarade ord:
                    </h3> */}
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
          {/* <div className="text-lg">
            rätta svar: {statistics.last100.correctAnswers} av{" "}
            {statistics.last100.answeredQuestions.length}
          </div> */}
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
                  "Du har inte rättat några ord än, fortsätt plugga!"
                ) : (
                  <div className=" ">
                    {/* <h3 className="text-lg font-medium tracking-tight mt-4 mb-2">
                      Rätt svarade ord:
                    </h3> */}
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
        </div>
      </div>
    </div>
  );
}
