import { axios } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import CompletionCircle from "../Components/CompletionCircle";

interface Statistics {
  totalCorrectlyAnsweredWords: number;
  totalWords: number;
  last10: {
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
  if (isStatisticsLoading || statistics === undefined) {
    return <div></div>;
  }
  return (
    <div className="lg:p-8  h-full ">
      <div className=" lg:p-4 pt-16">
        <div className="p-8 bg-white rounded-md shadow-md border border-black/20 max-w-xl mb-8">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Antal unika ord du har svarat rätt på
          </h2>
          <CompletionCircle
            currentAmount={statistics.totalCorrectlyAnsweredWords}
            totalAmount={statistics.totalWords}
            colour="green"
          />
        </div>

        <div className="p-2 lg:p-8  lg:border-1 shadow-md border-black/20 max-w-xl rounded-md bg-white">
          <h2 className="text-2xl font-medium tracking-tight mb-4">
            Senaste 10 frågorna
          </h2>
          <div className="text-lg">
            rätta svar: {statistics.last10.correctAnswers} av{" "}
            {statistics.last10.answeredQuestions.length}
          </div>
          <div className="mt-4">
            <table className="table-auto w-full overflow-auto max-w-full">
              <thead>
                <tr>
                  <th className="text-left pl-1 font-medium tex-xl">Ord</th>
                  <th className="text-left pl-1 font-medium tex-xl">
                    Rätt svar
                  </th>
                  <th className="text-left pl-1 font-medium tex-xl">
                    Ditt svar
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {statistics.last10.answeredQuestions.map((question, index) => (
                  <tr
                    key={index}
                    className={
                      clsx("bg-gray-100")
                      // "border-t",
                    }
                  >
                    <td className="px-1 lg:py-2 py-1 lg:px-2 border-1 lg:border-2 wrap-anywhere text-sm lg:text-lg">
                      {question.word}
                    </td>
                    <td className="px-1 lg:py-2 py-1 lg:px-2 border-1 lg:border-2 wrap-anywhere text-sm lg:text-lg">
                      {question.correctAnswer}
                    </td>
                    <td
                      className={clsx(
                        "px-1 lg:py-2 py-1 lg:px-2 border-1 lg:border-2 wrap-anywhere text-sm lg:text-lg",
                        question.isCorrect ? "bg-green-100" : "bg-red-100",
                      )}
                    >
                      {question.userAnswer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-4">
            Mer statistik kommer i framtiden, t.ex. statistik över tid, antal
            ord kvar att plugga osv.
          </div> */}
        </div>
      </div>
    </div>
  );
}
