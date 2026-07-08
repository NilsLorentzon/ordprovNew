import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axios } from "../../lib/axios";
import {
  loadWordCPState,
  saveWordCPState,
  unlockWordStage,
  getWordStageById,
  getWordStageSession,
  getWordDailySession,
  rateWordCard,
  getWordCPForecast,
  nextUnstartedWordOrder,
  getWordStages,
  Rating,
} from "./wordCoursePlanLogic";
import type { WordCoursePlanState, WordSRCard } from "./wordCoursePlanLogic";
import { PartOfSpeech } from "../Quiz/Quiz";

// ── Types ──────────────────────────────────────────────────────────────────────

interface WordDetail {
  word: string;
  definitions: {
    definition: string;
    shortDefinition: string;
    longDefinition: string;
  };
  partsOfSpeech: string[];
  sentences: string[];
}

interface QueueItem {
  card: WordSRCard;
  stageId?: string;
}

// ── Rating button config ──────────────────────────────────────────────────────

const RATINGS = [
  {
    rating: Rating.Again,
    label: "Blankt",
    sublabel: "1",
    color: "#ef4444",
    hotkey: "1",
  },
  {
    rating: Rating.Hard,
    label: "Svårt",
    sublabel: "2",
    color: "#f97316",
    hotkey: "2",
  },
  {
    rating: Rating.Good,
    label: "Okej",
    sublabel: "3",
    color: "#3b82f6",
    hotkey: "3",
  },
  {
    rating: Rating.Easy,
    label: "Enkelt",
    sublabel: "4",
    color: "#22c55e",
    hotkey: "4",
  },
] as const;

// ── Component ──────────────────────────────────────────────────────────────────

export default function WordStageQuiz() {
  const { stageId: rawId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const stageId = rawId ? decodeURIComponent(rawId) : "";
  const isDailyMode = stageId === "daglig";
  const stage = !isDailyMode && stageId ? getWordStageById(stageId) : undefined;

  // ── State ──────────────────────────────────────────────────────────────────
  const [cpState, setCPState] = useState<WordCoursePlanState>(() =>
    loadWordCPState(),
  );
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [initialSize, setInitialSize] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // ── Init session ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isDailyMode && !stage) return;
    const s = loadWordCPState();
    setCPState(s);
    if (isDailyMode) {
      const cards = getWordDailySession(s);
      setQueue(cards.map((c) => ({ card: c, stageId: c.stageId })));
      setInitialSize(cards.length);
    } else {
      const cards = getWordStageSession(s, stageId);
      setQueue(cards.map((c) => ({ card: c })));
      setInitialSize(cards.length);
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  // ── Fetch word details from backend ─────────────────────────────────────────

  const currentCard = queue[0]?.card ?? null;

  const { data: wordDetail, isFetching: wordFetching } = useQuery<WordDetail>({
    queryKey: ["word-detail", currentCard?.word],
    queryFn: () => axios.get(`word/${encodeURIComponent(currentCard!.word)}`),
    enabled: !!currentCard?.word,
    staleTime: 1000 * 60 * 60, // cache 1 hour
    retry: 1,
  });

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!queue.length) return;
      const current = queue[0];
      const ns = rateWordCard(cpState, current.card.id, rating);
      saveWordCPState(ns);
      setCPState(ns);

      const [, ...rest] = queue;
      const updatedCard = ns.cards.find((c) => c.id === current.card.id);
      const todayStr = new Date().toISOString().slice(0, 10);
      const dueToday =
        updatedCard &&
        updatedCard.state !== 0 &&
        updatedCard.due.slice(0, 10) <= todayStr;

      const newQueue = dueToday
        ? [...rest, { card: updatedCard!, stageId: current.stageId }]
        : rest;

      if (dueToday) setInitialSize((n) => n + 1);
      if (newQueue.length === 0) setSessionDone(true);
      setQueue(newQueue);
      setShowAnswer(false);
    },
    [cpState, queue],
  );

  useEffect(() => {
    if (!initialized || sessionDone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (showAnswer) {
        if (e.key === "1") handleRate(Rating.Again);
        else if (e.key === "2") handleRate(Rating.Hard);
        else if (e.key === "3") handleRate(Rating.Good);
        else if (e.key === "4") handleRate(Rating.Easy);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setShowAnswer(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [initialized, sessionDone, showAnswer, handleRate]);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const progress = initialSize - queue.length;
  const forecast = useMemo(() => getWordCPForecast(cpState), [cpState]);
  const maxForecast = Math.max(...forecast.map((f) => f.count), 1);

  // ── Early returns ────────────────────────────────────────────────────────────

  if (!isDailyMode && !stage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-4">
          <p className="text-slate-700 mb-4">Etapp hittades inte.</p>
          <button
            onClick={() => navigate("/kursplan-ord")}
            className="text-p-100 underline text-sm"
          >
            Tillbaka till kursplan
          </button>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-700">Laddar etapp...</p>
      </div>
    );
  }

  if (!isDailyMode && !cpState.startedStageIds.includes(stageId)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm text-center shadow-md">
          <h2 className="text-xl font-bold mb-3 text-slate-900">
            {stage?.name}
          </h2>
          <p className="text-slate-700 text-sm mb-5">
            Den här etappen är inte upplåst ännu.
          </p>
          <button
            onClick={() => navigate("/kursplan-ord")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-xl text-sm"
          >
            Till kursplan
          </button>
        </div>
      </div>
    );
  }

  if (initialized && initialSize === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm text-center shadow-md">
          <h2 className="text-xl font-bold mb-2 text-slate-900">
            {isDailyMode ? "Inga ord att öva idag!" : "Inga ord att öva!"}
          </h2>
          <p className="text-slate-700 text-sm mb-5">
            {isDailyMode
              ? "Kom tillbaka imorgon."
              : "Inga fler ord att öva just nu."}
          </p>
          <button
            onClick={() => navigate("/kursplan-ord")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm"
          >
            Till kursplan
          </button>
        </div>
      </div>
    );
  }

  if (sessionDone) {
    const allStages = getWordStages();
    const nextOrder = nextUnstartedWordOrder(cpState);
    const nextStage = allStages.find((s) => s.order === nextOrder) ?? null;

    const handleUnlockNext = () => {
      if (!nextStage) return;
      const ns = unlockWordStage(cpState, nextStage.id);
      saveWordCPState(ns);
      setCPState(ns);
      navigate("/kursplan-ord");
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm shadow-lg">
          <h2 className="text-2xl font-bold mb-1 text-slate-900">
            {isDailyMode ? "Dagens session klar!" : "Etapp klar!"}
          </h2>
          <p className="text-slate-700 text-sm mb-5">
            Du övade {initialSize} ord.
          </p>

          {/* Forecast */}
          <div className="mb-5">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-2">
              Repetition — kommande 14 dagar
            </p>
            <div className="flex items-end gap-0.5 h-16">
              {forecast.map((f, i) => {
                const h = Math.max(
                  (f.count / maxForecast) * 100,
                  f.count > 0 ? 8 : 1,
                );
                return (
                  <div
                    key={f.date}
                    className="flex-1 flex flex-col items-center justify-end gap-1"
                    style={{ height: "100%" }}
                  >
                    {f.count > 0 && (
                      <span
                        className={`text-[10px] tabular-nums leading-none ${
                          i === 0 ? "text-p-100" : "text-slate-600"
                        }`}
                      >
                        {f.count}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-sm ${i === 0 ? "bg-p-100" : "bg-slate-200"}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-600 text-center mt-1.5">
              {forecast[0].count > 0
                ? `${forecast[0].count} ord att öva idag`
                : "Inga fler ord att öva idag"}
            </p>
          </div>

          {nextStage && (
            <div className="bg-slate-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-slate-500 mb-0.5">Nästa etapp</p>
              <p className="text-sm text-slate-900 font-medium mb-2">
                {nextStage.name}
              </p>
              {forecast[0].count > 0 && (
                <p className="text-xs text-amber-600 mb-2">
                  Tips: du har {forecast[0].count} ord idag — repetera dem
                  innan du lägger till mer.
                </p>
              )}
              <button
                onClick={handleUnlockNext}
                className="w-full bg-p-100 hover:bg-p-200 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Lås upp nästa etapp
              </button>
            </div>
          )}
          <button
            onClick={() => navigate("/kursplan-ord")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Till kursplan
          </button>
        </div>
      </div>
    );
  }

  // ── Main quiz view ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => navigate("/kursplan-ord")}
          className="text-slate-700 hover:text-slate-900 text-sm transition-colors"
        >
          ← Kursplan
        </button>
        <span className="text-sm font-medium text-slate-600 tabular-nums">
          {progress}/{initialSize}
        </span>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center px-4 pt-6 pb-32 max-w-3xl mx-auto w-full">
        {currentCard && (
          <div className="w-full">
            {/* Word card */}
            <div className="border border-slate-200 rounded-xl bg-white shadow-md p-6 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                Vad betyder
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {currentCard.word}
              </h2>

              {showAnswer && (
                <div className="border-t border-slate-200 pt-4">
                  {wordFetching ? (
                    <p className="text-slate-600 text-sm">Laddar...</p>
                  ) : wordDetail ? (
                    <>
                      <div className="mb-4">
                        <h4 className="text-lg font-medium mb-0.5 text-slate-900">
                          Definition
                        </h4>
                        <div className="text-slate-800">
                          {wordDetail.definitions.definition}
                        </div>
                      </div>
                      {wordDetail.partsOfSpeech.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-lg font-medium mb-0.5 text-slate-900">
                            {wordDetail.partsOfSpeech.length > 1
                              ? "Ordklasser"
                              : "Ordklass"}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {wordDetail.partsOfSpeech.map((pos, i) => (
                              <PartOfSpeech key={i} part={pos} />
                            ))}
                          </div>
                        </div>
                      )}
                      {wordDetail.sentences.length > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-1 text-slate-900">
                            Exempelmeningar
                          </h4>
                          <ul className="list-disc pl-4">
                            {wordDetail.sentences.map((s, i) => (
                              <li key={i} className="mb-2 text-slate-800">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-600 text-sm italic">
                      Ingen ytterligare information tillgänglig.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar — fixed */}
      <div className="fixed bottom-0 left-0 md:left-60 right-0 z-20 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] p-3 pb-6">
        <div className="max-w-xl mx-auto w-full">
          {showAnswer ? (
            <div>
              <p className="text-center text-slate-600 text-xs mb-3">
                Hur väl kunde du ordet?
              </p>
              <div className="flex gap-2">
                {RATINGS.map(({ rating, label, sublabel, color, hotkey }) => (
                  <button
                    key={hotkey}
                    onClick={() => handleRate(rating)}
                    className="flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-2 font-semibold text-sm transition-colors hover:opacity-80 active:scale-95"
                    style={{
                      background: color + "15",
                      borderColor: color + "55",
                      color,
                    }}
                  >
                    <span>{label}</span>
                    <span
                      className="text-xs opacity-50 mt-0.5"
                      aria-hidden="true"
                    >
                      {hotkey}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-p-100 hover:bg-p-200 active:bg-p-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Visa svar{" "}
              <span className="hidden md:inline opacity-50 text-xs ml-1">
                (space)
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
