import React, { useEffect, useMemo, useState } from "react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

type SessionType = "work" | "break";

type DailyStats = {
  date: string;
  workedSeconds: number;
  breakSeconds: number;
};

function TomatoLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M32 12C40.5 12 50 16.8 52.8 26.8C55.6 36.8 49.8 50.5 32 52.5C14.2 50.5 8.4 36.8 11.2 26.8C14 16.8 23.5 12 32 12Z"
        fill="#E53935"
      />
      <path
        d="M32 16C39.4 16 46.7 20.2 49 28.1C51.2 36.1 46.6 46.9 32 48.7C17.4 46.9 12.8 36.1 15 28.1C17.3 20.2 24.6 16 32 16Z"
        fill="#F44336"
      />
      <path
        d="M31.5 15.5C28.2 11 23.2 9.2 18 10.7C20.8 12.3 22.8 14.6 24.2 17.4L31.5 15.5Z"
        fill="#2E7D32"
      />
      <path
        d="M32.5 15.5C35.8 11 40.8 9.2 46 10.7C43.2 12.3 41.2 14.6 39.8 17.4L32.5 15.5Z"
        fill="#2E7D32"
      />
      <path d="M27 18.2L37 18.2L32 8L27 18.2Z" fill="#388E3C" />
      <ellipse cx="25" cy="30" rx="5" ry="3" fill="#FF8A80" opacity="0.35" />
    </svg>
  );
}

const STORAGE_KEY = "pomodoro-daily-stats";

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function loadDailyStats(): DailyStats {
  const today = getTodayDateString();
  const fallback: DailyStats = {
    date: today,
    workedSeconds: 0,
    breakSeconds: 0,
  };

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as DailyStats;
    if (parsed.date !== today) return fallback;
    return {
      date: parsed.date,
      workedSeconds: Number(parsed.workedSeconds) || 0,
      breakSeconds: Number(parsed.breakSeconds) || 0,
    };
  } catch {
    return fallback;
  }
}

export default function Pomodoro() {
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [remainingSeconds, setRemainingSeconds] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats>(() => loadDailyStats());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyStats));
  }, [dailyStats]);

  useEffect(() => {
    const today = getTodayDateString();
    if (dailyStats.date !== today) {
      setDailyStats({ date: today, workedSeconds: 0, breakSeconds: 0 });
    }
  }, [dailyStats.date]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setSessionType((currentSession) =>
            currentSession === "work" ? "break" : "work"
          );
          return sessionType === "work" ? BREAK_SECONDS : WORK_SECONDS;
        }
        return prev - 1;
      });

      setDailyStats((prev) => ({
        ...prev,
        workedSeconds:
          sessionType === "work" ? prev.workedSeconds + 1 : prev.workedSeconds,
        breakSeconds:
          sessionType === "break" ? prev.breakSeconds + 1 : prev.breakSeconds,
      }));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, sessionType]);

  const workedMinutes = useMemo(
    () => Math.floor(dailyStats.workedSeconds / 60),
    [dailyStats.workedSeconds]
  );
  const breakMinutes = useMemo(
    () => Math.floor(dailyStats.breakSeconds / 60),
    [dailyStats.breakSeconds]
  );

  const switchSession = () => {
    setSessionType((current) => (current === "work" ? "break" : "work"));
    setRemainingSeconds(sessionType === "work" ? BREAK_SECONDS : WORK_SECONDS);
  };

  const resetCurrentSession = () => {
    setIsRunning(false);
    setRemainingSeconds(sessionType === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const resetToday = () => {
    setIsRunning(false);
    setSessionType("work");
    setRemainingSeconds(WORK_SECONDS);
    setDailyStats({
      date: getTodayDateString(),
      workedSeconds: 0,
      breakSeconds: 0,
    });
  };



  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-center text-2xl font-bold">Pomme d&apos;or</h1>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((prev) => !prev)}
          className={`relative rounded-full p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isRunning
              ? "scale-100 shadow-[0_0_0_8px_rgba(34,197,94,0.18)]"
              : "hover:scale-105 shadow-[0_0_0_6px_rgba(239,68,68,0.12)]"
          }`}
          aria-label={isRunning ? "Pause Pomodoro timer" : "Start Pomodoro timer"}
          title="Pomodoro control"
        >
          <TomatoLogo size={96} />
          <span className="pointer-events-none absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow">
            {isRunning ? (
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="block h-3 w-1 rounded-sm bg-gray-700" />
                <span className="block h-3 w-1 rounded-sm bg-gray-700" />
              </span>
            ) : (
              <span
                className="block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-gray-700"
                aria-hidden="true"
              />
            )}
          </span>
        </button>
        <p className="text-xs text-gray-500">Tap the tomato to control the timer</p>
      </div>

      <p className="text-sm text-center text-gray-600">
        Work session: 25 min. Break session: 5 min.
      </p>

      <div className="rounded-lg bg-gray-100 p-5 text-center">
        <p className="text-sm uppercase tracking-wide text-gray-600">
          {sessionType === "work" ? "Work" : "Break"}
        </p>
        <p className="mt-2 text-5xl font-semibold">{formatTime(remainingSeconds)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          onClick={resetCurrentSession}
        >
          Reset Session
        </button>
        <button
          type="button"
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          onClick={switchSession}
        >
          Skip
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h2 className="font-semibold">Today</h2>
        <p className="mt-2">Worked: {workedMinutes} min</p>
        <p>Breaks: {breakMinutes} min</p>
        <button
          type="button"
          className="mt-3 rounded-md bg-red-100 px-3 py-1.5 text-red-700 hover:bg-red-200"
          onClick={resetToday}
        >
          Reset Today
        </button>
      </div>
    </div>
  );
}
