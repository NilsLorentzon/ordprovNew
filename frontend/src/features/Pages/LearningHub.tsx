import React, { useContext } from "react";
import LearningPageWrapper from "./LearningPageWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "../../lib/axios";
import type { LearningCardWithWord } from "../../types/types";
import { AuthContext } from "../../providers/AuthenticationProvider";
import ControlledSelect from "../../Components/ControlledSelect";
import ControlledInput from "../../Components/ControlledInput";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../lib/react-query";
import LearningStatistics from "../Learning/LearningStatistics";

export default function LearningHub() {
  const navigate = useNavigate();
  const [userSettings, setUserSettings] = React.useState<{
    amountOfWordsPerDay: number;
    wordList: string;
    learningMode: "onlyWord" | "multipleChoice";
  }>({
    amountOfWordsPerDay: 20,
    wordList: "hp",
    learningMode: "onlyWord",
  });
  const { auth } = useContext(AuthContext);
  const {
    data: wordData,
    isLoading: isWordDataLoading,
    refetch: refetchWordData,
  } = useQuery({
    queryKey: ["words"],
    queryFn: (): Promise<LearningCardWithWord[]> => {
      if (!auth.email) {
        return new Promise<LearningCardWithWord[]>((resolve) => {
          resolve([]);
        });
      }
      return axios.get(`learning/cards`);
    },
    refetchOnWindowFocus: false,
  });

  const initializeLearningWithSettings = (settings: typeof userSettings) => {
    return axios.post(`learning/initialize`, settings);
  };

  const initMutation = useMutation(
    (settings: typeof userSettings) => initializeLearningWithSettings(settings),
    {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["words"],
        });
        queryClient.invalidateQueries({
          queryKey: ["words"],
        });
        // clear cache for "words" query key
        navigate("/learning/start");
      },
    },
  );
  if (isWordDataLoading || !wordData) {
    return null;
  }
  if (wordData.length > 0) {
    return <LearningStatistics />;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-2xl mx-auto md:p-6 py-6">
      <div className="mb-6 bg-white border border-black/30 rounded-md p-4 shadow-md text-lg">
        <h1 className="text-3xl font-medium mb-4">
          Välkommen till inlärningssidan
        </h1>
        <p className="mb-2">
          Inlärningen sker med hjälp utav spaced repetition vilket innebär att
          du repeterar ord med ökande intervaller för att flytta dem från
          korttidsminnet till långtidsminnet. Svårare ord visas oftare medan
          enkla ord visas mer sällan.
        </p>
        <p className="mb-2">
          Du kommer att få ett antal nya ord per dag som du ska lära dig.
        </p>
        <ul className="list-disc pl-5 mt-1 pb-2">
          <li>
            Tryck på <strong>Visa svar</strong> för att visa svaret.
          </li>
          <li>
            Tryck på <strong>Blankt</strong>, <strong>Svårt</strong>,{" "}
            <strong>Okej</strong> eller <strong>Enkel</strong> för att markera
            hur väl du kunde ordet.{" "}
          </li>
          <li>
            <strong>Blankt</strong> betyder att du inte kunde ordet.
          </li>
          <li>
            <strong>Svårt</strong> betyder att du kunde ordet lite men hade
            svårt att komma ihåg det.
          </li>
          <li>
            <strong>Okej</strong> betyder att du kunde ordet.
          </li>
          <li>
            <strong>Enkel</strong> betyder att du kunde ordet väldigt bra.
          </li>
          <li>
            Om du väljer <strong>Blankt</strong> eller <strong>Svårt</strong> så
            kommer dom dyka upp igen på slutet av dagslistan för repetition.
          </li>
          <li>
            Varje dag kommer du även behöva repetera ord som du har lärt dig
            tidigare.
          </li>
          {!auth.email && (
            <li>
              Inlärningen kräver att du är inloggad för att spara dina framsteg.
            </li>
          )}
        </ul>

        <div className="flex gap-2 justify-end">
          {auth.email ? (
            <button
              type="submit"
              className="bg-p-100 text-white px-4 py-2 rounded"
              onClick={() => {
                initMutation.mutate({
                  amountOfWordsPerDay: 20,
                  wordList: "hp",
                  learningMode: "onlyWord",
                });
              }}
            >
              Starta inlärning
            </button>
          ) : (
            <button
              type="button"
              className="bg-p-100 text-white px-4 py-2 rounded"
              onClick={() => navigate("/login")}
            >
              Logga in
            </button>
          )}
        </div>
      </div>

      {/* <form
          className="w-full bg-white border rounded-md p-4 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            initMutation.mutate(userSettings);
          }}
        >
          <div className="mb-4">
            <ControlledInput
              value={userSettings.amountOfWordsPerDay}
              setter={(value) => {
                setUserSettings((s) => ({
                  ...s,
                  amountOfWordsPerDay: Number(value),
                }));
              }}
              label="Antal ord per dag"
            ></ControlledInput>
          </div>

          <div className="mb-4">
            <ControlledSelect
              label="Ordlista"
              options={[
                { label: "Tidigare högskoleprov", value: "hp" },
                { label: "Alla 10 000 ord", value: "all" },
              ]}
              value={userSettings.wordList}
              onChange={(option) => {
                setUserSettings((s) => ({ ...s, wordList: option.value }));
              }}
            />
          </div>

          <div className="mb-4">
            <ControlledSelect
              label="Inlärningsläge"
              options={[
                { label: "Endast ordet", value: "onlyWord" },
                { label: "Flervalsfrågor", value: "multipleChoice" },
              ]}
              value={userSettings.learningMode}
              onChange={(option) => {
                setUserSettings((s) => ({ ...s, learningMode: option.value }));
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-p-100 text-white px-4 py-2 rounded"
              disabled={initMutation.isLoading}
            >
              Starta inlärning
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={() => setInitializeLearning(false)}
            >
              Hoppa över
            </button>
          </div>
        </form> */}
    </div>
  );
}
