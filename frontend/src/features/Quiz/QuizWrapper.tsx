import { useState } from "react";
import QuizMultipleChoiceWrapper from "./QuizMultipleChoiceWrapper";
import ControlledSelect from "../../Components/ControlledSelect";
import { useNavigate } from "react-router-dom";
import { routePaths } from "../../routes/MainRoutes";

export default function QuizWrapper() {
  // get parameters from url
  const urlParams = new URLSearchParams(window.location.search);
  const quizIdFromUrl = urlParams.get("start");
  const navigate = useNavigate();
  const [isQuizStarted, setIsQuizStarted] = useState(quizIdFromUrl !== null);
  const [amountOfQuestions, setAmountOfQuestions] = useState(10);
  const [questionType, setQuestionType] = useState("multipleChoice");
  const [alternativesAmount, setAlternativesAmount] = useState(5);

  if (!isQuizStarted) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="rounded-md bg-white border shadow-md border-black/20 p-8 max-w-md w-full">
          <h2 className="text-2xl tracking-tight font-medium mb-4 text-black">
            Provinställningar
          </h2>
          <div className="w-full max-w-44 ">
            <ControlledSelect
              label="Antal frågor"
              options={[
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                // { label: "50", value: 50 },
              ]}
              value={amountOfQuestions}
              onChange={(option, action) => {
                // console.log("Selected option:", option);
                // console.log("Action meta:", action);
                setAmountOfQuestions(option.value);
              }}
            />
            <div className="my-4"></div>
            <ControlledSelect
                label="Antal Alternativ"
                options={[
                  { label: "4", value: 4 },
                  { label: "5", value: 5 },
                  { label: "6", value: 6 },
                  { label: "7", value: 7 },
                  { label: "8", value: 8 },
                  { label: "9", value: 9 },
                  { label: "10", value: 10 },
                ]}
                value={alternativesAmount}
                onChange={(option, action) => {
                  setAlternativesAmount(option.value);
                }}
              />
            {/* <ControlledSelect
              label="Ordlista (fler kommer senare)"
              options={[
                { label: "Alla ord", value: "all" },
                { label: "Tidigare högskoleprov", value: "hp" },
                { label: "Gamla ordprovslistan", value: "oldOrdprov" },
              ]}
              value={"hp"}
              onChange={(option, action) => {
                console.log("Selected option:", option);
                console.log("Action meta:", action);
              }}
            /> */}
            {/* <ControlledSelect
              label="Provtyp"
              options={[
                { label: "Flervalsfrågor (standard)", value: "multipleChoice" },
                {
                  label: "Skriv definition (avancerad)",
                  value: "writeDefinition",
                },
              ]}
              value={questionType}
              onChange={(option, action) => {
                // console.log("Selected option:", option);
                // console.log("Action meta:", action);
                console.log("Selected question type:", option.value);
                setQuestionType(option.value);
              }}
            /> */}
          </div>
          {/* {questionType === "multipleChoice" && (
            <div className="w-full flex gap-4 mt-4">
              
              <div className="w-full"></div>
            </div>
          )} */}
          <div className="flex justify-end mt-8">
            <button
              className="px-4 py-2 bg-p-200 text-white text-xl rounded-lg hover:bg-p-200 hover:scale-110 transition duration-300"
              onClick={() => {
                navigate(
                  `${routePaths.provStart}?antal=${amountOfQuestions}&typ=${questionType}${questionType === "multipleChoice" ? `&alternativ=${alternativesAmount}` : ""}`,
                );
                setIsQuizStarted(true);
              }}
            >
              {" "}
              Starta prov
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <QuizMultipleChoiceWrapper />;
}
