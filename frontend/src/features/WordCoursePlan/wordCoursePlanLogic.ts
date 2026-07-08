import { fsrs, createEmptyCard, Rating } from "ts-fsrs";
import type { Card, Grade } from "ts-fsrs";
import wordDataRaw from "../Learning/wordData.json";

export { Rating };

const scheduler = fsrs();

// ── Types ──────────────────────────────────────────────────────────────────────

export interface WordSRCard {
  id: string; // matches _id from wordData.json
  word: string;
  // FSRS fields (dates as ISO strings)
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number; // 0=New, 1=Learning, 2=Review, 3=Relearning
  last_review?: string;
}

export interface WordCourseStage {
  id: string;
  name: string;
  shortName: string;
  order: number;
  wordIds: string[];
}

export interface WordCoursePlanState {
  startedStageIds: string[];
  cards: WordSRCard[];
}

// ── Raw word shape from wordData.json ─────────────────────────────────────────

interface RawWord {
  _id: string;
  word: string;
  partsOfSpeech: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const WORDS_PER_STAGE = 20;
const CP_LS_KEY = "word_cp_state_v1";

// ── FSRS helpers ──────────────────────────────────────────────────────────────

function toFSRSCard(c: WordSRCard): Card {
  return {
    due: new Date(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as any,
    last_review: c.last_review ? new Date(c.last_review) : undefined,
    learning_steps: 0,
  };
}

function mergeFSRS(srCard: WordSRCard, updated: Card): WordSRCard {
  return {
    ...srCard,
    due: updated.due.toISOString(),
    stability: updated.stability,
    difficulty: updated.difficulty,
    elapsed_days: updated.elapsed_days,
    scheduled_days: updated.scheduled_days,
    reps: updated.reps,
    lapses: updated.lapses,
    state: updated.state as number,
    last_review: updated.last_review?.toISOString(),
  };
}

// ── Master word list (original order from file) ───────────────────────────────

const masterWords: RawWord[] = (wordDataRaw as RawWord[]).filter(
  (w) => w._id && w.word,
);

export function getMasterWords(): RawWord[] {
  return masterWords;
}

// ── Stage definitions ─────────────────────────────────────────────────────────

let _stages: WordCourseStage[] | null = null;

export function getWordStages(): WordCourseStage[] {
  if (_stages) return _stages;

  const stages: WordCourseStage[] = [];
  const total = masterWords.length;
  const stageCount = Math.ceil(total / WORDS_PER_STAGE);

  for (let i = 0; i < stageCount; i++) {
    const start = i * WORDS_PER_STAGE;
    const end = Math.min(start + WORDS_PER_STAGE, total);
    const wordsInStage = masterWords.slice(start, end);
    const stageNumber = i + 1;
    stages.push({
      id: `stage-words-${stageNumber}`,
      name: `Etapp ${stageNumber} (ord ${start + 1}–${end})`,
      shortName: `Etapp ${stageNumber}`,
      order: i,
      wordIds: wordsInStage.map((w) => w._id),
    });
  }

  _stages = stages;
  return stages;
}

export function getWordStageById(id: string): WordCourseStage | undefined {
  return getWordStages().find((s) => s.id === id);
}

// ── Persistence ───────────────────────────────────────────────────────────────

export function loadWordCPState(): WordCoursePlanState {
  try {
    const raw = localStorage.getItem(CP_LS_KEY);
    if (raw) return JSON.parse(raw) as WordCoursePlanState;
  } catch {
    // ignore
  }
  return { startedStageIds: [], cards: [] };
}

export function saveWordCPState(state: WordCoursePlanState): void {
  try {
    localStorage.setItem(CP_LS_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

// ── Stage operations ──────────────────────────────────────────────────────────

/** Add a stage's cards to the state (idempotent). */
export function unlockWordStage(
  state: WordCoursePlanState,
  stageId: string,
): WordCoursePlanState {
  if (state.startedStageIds.includes(stageId)) return state;

  const stage = getWordStageById(stageId);
  if (!stage) return state;

  const existingIds = new Set(state.cards.map((c) => c.id));
  const wordMap = new Map(masterWords.map((w) => [w._id, w]));

  const newCards: WordSRCard[] = [];
  for (const id of stage.wordIds) {
    if (existingIds.has(id)) continue;
    const wordEntry = wordMap.get(id);
    if (!wordEntry) continue;
    const e = createEmptyCard();
    newCards.push({
      id,
      word: wordEntry.word,
      due: e.due.toISOString(),
      stability: e.stability,
      difficulty: e.difficulty,
      elapsed_days: e.elapsed_days,
      scheduled_days: e.scheduled_days,
      reps: e.reps,
      lapses: e.lapses,
      state: e.state as number,
    });
  }

  return {
    ...state,
    startedStageIds: [...state.startedStageIds, stageId],
    cards: [...state.cards, ...newCards],
  };
}

/** Order of the next stage not yet started. */
export function nextUnstartedWordOrder(state: WordCoursePlanState): number {
  const stages = getWordStages();
  const started = new Set(state.startedStageIds);
  const next = stages.find((s) => !started.has(s.id));
  return next?.order ?? stages.length;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Returns session cards for a single stage: due first (shuffled), then new (shuffled). */
export function getWordStageSession(
  state: WordCoursePlanState,
  stageId: string,
): WordSRCard[] {
  const stage = getWordStageById(stageId);
  if (!stage) return [];
  const cardIds = new Set(stage.wordIds);
  const todayStr = new Date().toISOString().slice(0, 10);

  const due = state.cards.filter(
    (c) => cardIds.has(c.id) && c.state !== 0 && c.due.slice(0, 10) <= todayStr,
  );
  const newCards = state.cards.filter(
    (c) => cardIds.has(c.id) && c.state === 0,
  );
  return [...shuffle(due), ...shuffle(newCards)];
}

/** Returns all due + new cards across all started stages for the daily session. */
export function getWordDailySession(
  state: WordCoursePlanState,
): Array<WordSRCard & { stageId: string }> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const startedSet = new Set(state.startedStageIds);
  const stages = getWordStages().filter((s) => startedSet.has(s.id));
  const result: Array<WordSRCard & { stageId: string }> = [];

  for (const stage of stages) {
    const cardIds = new Set(stage.wordIds);
    const due = shuffle(
      state.cards.filter(
        (c) =>
          cardIds.has(c.id) && c.state !== 0 && c.due.slice(0, 10) <= todayStr,
      ),
    ).map((c) => ({ ...c, stageId: stage.id }));

    const newCards = shuffle(
      state.cards.filter((c) => cardIds.has(c.id) && c.state === 0),
    ).map((c) => ({ ...c, stageId: stage.id }));

    result.push(...due, ...newCards);
  }
  return result;
}

/** Apply an FSRS rating to a card and return updated state. */
export function rateWordCard(
  state: WordCoursePlanState,
  cardId: string,
  rating: Rating,
): WordCoursePlanState {
  const now = new Date();
  const cards = state.cards.map((c) => {
    if (c.id !== cardId) return c;
    const scheduling = scheduler.repeat(toFSRSCard(c), now);
    const updated = scheduling[rating as Grade]?.card;
    if (!updated) return c;
    return mergeFSRS(c, updated);
  });
  return { ...state, cards };
}

// ── Progress & statistics ─────────────────────────────────────────────────────

export interface WordStageProgress {
  total: number;
  learned: number; // state !== 0
  mastered: number; // state === 2
}

export function getWordStageProgress(
  state: WordCoursePlanState,
  stageId: string,
): WordStageProgress {
  const stage = getWordStageById(stageId);
  if (!stage) return { total: 0, learned: 0, mastered: 0 };
  const cardIds = new Set(stage.wordIds);
  const stageCards = state.cards.filter((c) => cardIds.has(c.id));
  return {
    total: stage.wordIds.length,
    learned: stageCards.filter((c) => c.state !== 0).length,
    mastered: stageCards.filter((c) => c.state === 2).length,
  };
}

/** Review-count forecast for next `days` days. New cards count toward today. */
export function getWordCPForecast(
  state: WordCoursePlanState,
  days = 14,
): { date: string; count: number }[] {
  const today = new Date();
  const newCardCount = state.cards.filter((c) => c.state === 0).length;
  const result: { date: string; count: number }[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const reviewCount = state.cards.filter(
      (c) => c.state !== 0 && c.due.slice(0, 10) === dateStr,
    ).length;
    result.push({
      date: dateStr,
      count: i === 0 ? reviewCount + newCardCount : reviewCount,
    });
  }
  return result;
}

/** Overall stats. */
export function getWordCPStats(state: WordCoursePlanState) {
  return {
    totalWords: masterWords.length,
    introduced: state.cards.length,
    stagesStarted: state.startedStageIds.length,
    totalStages: getWordStages().length,
  };
}
