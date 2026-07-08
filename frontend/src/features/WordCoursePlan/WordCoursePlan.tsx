import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  loadWordCPState,
  saveWordCPState,
  unlockWordStage,
  getWordStages,
  getWordStageProgress,
  getWordCPForecast,
  getWordCPStats,
  nextUnstartedWordOrder,
} from "./wordCoursePlanLogic";
import type {
  WordCoursePlanState,
  WordCourseStage,
} from "./wordCoursePlanLogic";

// ── Helpers ────────────────────────────────────────────────────────────────────

const stageRoute = (stageId: string) =>
  `/kursplan-ord/etapp/${encodeURIComponent(stageId)}`;

// ── Component ──────────────────────────────────────────────────────────────────

export default function WordCoursePlan() {
  const navigate = useNavigate();
  const [cpState, setCPState] = useState<WordCoursePlanState>(() =>
    loadWordCPState(),
  );
  const [showGuideModal, setShowGuideModal] = useState(false);

  const stages = useMemo(() => getWordStages(), []);
  const forecast = useMemo(() => getWordCPForecast(cpState), [cpState]);
  const stats = useMemo(() => getWordCPStats(cpState), [cpState]);

  const startedSet = new Set(cpState.startedStageIds);
  const nextOrder = nextUnstartedWordOrder(cpState);
  const nextStage = stages.find((s) => s.order === nextOrder) ?? null;

  const canUnlock = forecast[0].count === 0;

  const firstPracticeStage = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    for (const s of stages) {
      if (!startedSet.has(s.id)) continue;
      const cardIds = new Set(s.wordIds);
      const hasPracticeable = cpState.cards.some(
        (c) =>
          cardIds.has(c.id) &&
          (c.state === 0 || c.due.slice(0, 10) <= todayStr),
      );
      if (hasPracticeable) return s;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpState, stages]);

  const handleUnlock = () => {
    if (!nextStage) return;
    const updated = unlockWordStage(cpState, nextStage.id);
    saveWordCPState(updated);
    setCPState(updated);
  };

  const maxForecast = Math.max(...forecast.map((f) => f.count), 1);

  // ── Guide content ─────────────────────────────────────────────────────────

  const guideBody = (
    <div className="space-y-4 text-sm text-black/70">
      <div className="space-y-4">
        {[
          {
            n: 1,
            title: "Visa svaret",
            body: 'Tryck på "Visa svar" för att se definitionen och exempelmeningar.',
          },
          {
            n: 2,
            title: "Betygsätt ordet",
            body: "Välj hur väl du kunde ordet (1–4). FSRS-algoritmen räknar ut när du ska se det igen.",
          },
          {
            n: 3,
            title: '"Öva nu" och 14-dagarsgrafen',
            body: '"Öva nu" samlar alla dagens förfallna och nya ord från alla upplåsta etapper. Grafen visar hur många ord som förfaller varje dag.',
          },
          {
            n: 4,
            title: "Kom tillbaka varje dag",
            body: "Kort repetition varje dag är effektivare än långa sessioner. 5 minuter om dagen räcker långt.",
          },
        ].map((s) => (
          <div key={s.n} className="flex items-start gap-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-p-100 text-white">
              {s.n}
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">{s.title}</p>
              <p className="text-slate-700 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Betygen 1–4</h3>
        <div className="space-y-3">
          {[
            {
              label: "Blankt",
              sub: "1",
              color: "#ef4444",
              desc: "Misslyckades. Köas om till slutet av sessionen.",
            },
            {
              label: "Svårt",
              sub: "2",
              color: "#f97316",
              desc: "Lyckades men svårt. Kortare intervall nästa gång.",
            },
            {
              label: "Okej",
              sub: "3",
              color: "#3b82f6",
              desc: "Utan problem. Standardintervall.",
            },
            {
              label: "Enkelt",
              sub: "4",
              color: "#22c55e",
              desc: "Trivialt lätt. Längre intervall.",
            },
          ].map((r) => (
            <div key={r.sub} className="flex items-start gap-3">
              <div
                className="shrink-0 w-16 flex flex-col items-center justify-center py-1.5 rounded-lg border text-sm font-semibold"
                style={{
                  background: r.color + "18",
                  borderColor: r.color + "55",
                  color: r.color,
                }}
              >
                <span>{r.label}</span>
                <span className="text-xs opacity-60">{r.sub}</span>
              </div>
              <p className="text-slate-700 leading-relaxed pt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-1">
          Låsa upp nästa etapp
        </h3>
        <p className="text-slate-700 leading-relaxed">
          Knappen <strong>"Lås upp etapp"</strong> är bara aktiv när inga ord
          förfaller idag. Det tvingar dig att hålla koll på repetitionerna innan
          du lägger till nytt material.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-1">Nya ord</h3>
        <p className="text-slate-700 leading-relaxed">
          Första gången du övar på ett ord så kommer det köas om samma runda
          fram tills att du markerar det som enkelt.
        </p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-1">Vad är FSRS?</h3>
        <p className="text-slate-700 leading-relaxed">
          FSRS (Free Spaced Repetition Scheduler) modellerar ditt minne och
          räknar ut exakt när du är på väg att glömma ett ord. Rätt svar =
          längre väntetid. Fel svar = kortare.
        </p>
      </div>
    </div>
  );

  // ── Stage row ─────────────────────────────────────────────────────────────

  const getStatus = (stage: WordCourseStage) => {
    if (startedSet.has(stage.id)) return "started" as const;
    if (stage.order === nextOrder) return "next" as const;
    return "locked" as const;
  };

  const renderStageRow = (stage: WordCourseStage) => {
    const status = getStatus(stage);
    const progress =
      status === "started"
        ? getWordStageProgress(cpState, stage.id)
        : { total: stage.wordIds.length, learned: 0, mastered: 0 };
    const pct =
      progress.total > 0
        ? Math.round((progress.learned / progress.total) * 100)
        : 0;

    return (
      <button
        key={stage.id}
        disabled={status !== "started"}
        onClick={() => status === "started" && navigate(stageRoute(stage.id))}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors rounded-lg ${
          status === "started"
            ? "hover:bg-slate-50 cursor-pointer active:bg-slate-100"
            : status === "next"
              ? "opacity-50 cursor-default"
              : "opacity-20 cursor-default"
        }`}
      >
        {/* Status dot */}
        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
          {status === "locked" ? (
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          ) : status === "next" ? (
            <div className="w-2.5 h-2.5 rounded-full border-2 border-p-100/50" />
          ) : pct >= 100 ? (
            <div className="w-2.5 h-2.5 rounded-full bg-p-100" />
          ) : (
            <div
              className="w-2.5 h-2.5 rounded-full border-2 border-p-100/70"
              style={{
                background: `conic-gradient(var(--color-p-100, #7c5cbf) ${pct * 3.6}deg, transparent 0)`,
              }}
            />
          )}
        </div>

        {/* Name */}
        <span className="flex-1 text-sm text-slate-900 truncate">
          {stage.shortName}
        </span>

        {/* Progress count */}
        {status === "started" && (
          <span className="text-xs text-slate-600 shrink-0 tabular-nums">
            {progress.learned}/{progress.total}
          </span>
        )}
      </button>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-slate-700 hover:text-slate-900 transition-colors text-sm px-1"
        >
          ← Hem
        </button>
        <h1 className="text-base font-semibold text-slate-900 flex-1">
          Kursplan – Ord
        </h1>
        <span className="text-xs text-slate-500">
          {stats.stagesStarted}/{stats.totalStages} etapper
        </span>
        {stats.stagesStarted > 0 && (
          <button
            onClick={() => setShowGuideModal(true)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-sm font-bold transition-colors"
            title="Visa guide"
            aria-label="Visa guide"
          >
            ?
          </button>
        )}
      </div>

      {/* ── Onboarding shown before any stage is unlocked ───────────────────── */}
      {stats.stagesStarted === 0 && (
        <div className="max-w-xl mx-auto px-4 pt-5 pb-10">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-p-100">
              Kom igång
            </p>
            <h2 className="text-2xl font-bold text-black leading-snug">
              Lär dig ord inför högskoleprovet – etapp för etapp
            </h2>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed mb-7">
            Kursplanen delar upp alla {stats.totalWords} ord i etapper om 20 ord
            vardera. Varje etapp låses upp när du är klar med repetitionerna för
            dagen. Inlärningen sker med{" "}
            <em className="not-italic text-black/80">spaced repetition</em> – du
            ser varje ord igen precis innan du är på väg att glömma det.
          </p>
          {guideBody}
          {nextStage && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 mt-6 shadow-sm">
              <p className="text-xs text-slate-500 mb-0.5">Redo att börja?</p>
              <p className="text-slate-900 font-medium text-sm mb-3">
                {nextStage.name}
              </p>
              <button
                onClick={handleUnlock}
                className="w-full bg-p-100 hover:bg-p-200 active:bg-p-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Lås upp och börja
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Regular UI ──────────────────────────────────────────────────────── */}
      {stats.stagesStarted > 0 && (
        <div className="max-w-xl mx-auto px-4 pt-5 space-y-4">
          {/* Overall progress */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-700">Introducerade ord</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {stats.introduced} / {stats.totalWords}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-p-100 h-1.5 rounded-full transition-all"
                style={{
                  width: `${
                    stats.totalWords > 0
                      ? (stats.introduced / stats.totalWords) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Forecast chart */}
          {stats.introduced > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h2 className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-3">
                Repetition — kommande 14 dagar
              </h2>
              <div className="flex items-end gap-0.75 h-20">
                {forecast.map((f, i) => {
                  const heightPct =
                    maxForecast > 0
                      ? Math.max(
                          (f.count / maxForecast) * 78,
                          f.count > 0 ? 6 : 1,
                        )
                      : 1;
                  const isToday = i === 0;
                  return (
                    <div
                      key={f.date}
                      className="flex-1 flex flex-col items-center justify-end gap-1"
                      style={{ height: "100%" }}
                    >
                      {f.count > 0 && (
                        <span
                          className={`text-[10px] tabular-nums leading-none ${
                            isToday ? "text-p-100" : "text-slate-600"
                          }`}
                        >
                          {f.count}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-sm ${
                          isToday ? "bg-p-100" : "bg-slate-200"
                        }`}
                        style={{ height: `${heightPct}%` }}
                        title={`${f.date}: ${f.count} ord`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 px-0.5">
                <span>Idag</span>
                <span>
                  {new Date(forecast[13]?.date ?? "").toLocaleDateString("sv", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-600 text-center mt-1">
                {forecast[0].count > 0
                  ? `${forecast[0].count} ord att öva idag`
                  : "Inga ord att öva idag"}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {firstPracticeStage && (
              <button
                onClick={() => navigate("/kursplan-ord/etapp/daglig")}
                className="w-full bg-p-100 hover:bg-p-200 active:bg-p-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Öva nu (
                {forecast[0].count > 0
                  ? `${forecast[0].count} ord idag`
                  : "fortsätt"}
                )
              </button>
            )}

            {nextStage && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Nästa etapp</p>
                    <p className="text-slate-900 font-medium text-sm">
                      {nextStage.name}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0 mt-1">
                    {nextStage.wordIds.length} ord
                  </span>
                </div>
                {!canUnlock && (
                  <p className="text-xs text-amber-600 mb-3">
                    Du har {forecast[0].count} ord kvar idag — öva klart dem
                    innan du låser upp mer.
                  </p>
                )}
                <button
                  onClick={handleUnlock}
                  disabled={!canUnlock}
                  className={`w-full font-semibold py-2.5 rounded-xl text-sm transition-colors ${
                    canUnlock
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-900"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Lås upp etapp
                </button>
              </div>
            )}

            {!nextStage && stats.stagesStarted === stats.totalStages && (
              <p className="text-center text-sm text-black/50 py-4">
                Alla etapper låsta upp! 🎉
              </p>
            )}
          </div>

          {/* Stage list */}
          <div className="space-y-1 pt-2 pb-4">
            <h2 className="text-xs font-medium text-slate-600 uppercase tracking-wider px-1 mb-1.5">
              Etapper
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
              {stages.map(renderStageRow)}
            </div>
          </div>
        </div>
      )}

      {/* ── Guide modal ─────────────────────────────────────────────────────── */}
      {showGuideModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 bg-black/40"
            onClick={() => setShowGuideModal(false)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Guide – hur kursplanen fungerar
                </h2>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="text-slate-700 hover:text-slate-900 w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-5">{guideBody}</div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
