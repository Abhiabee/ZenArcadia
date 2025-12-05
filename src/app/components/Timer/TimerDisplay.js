import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function TimerDisplay() {
  const [isMounted, setIsMounted] = useState(false);
  const timerState = useSelector((state) => state.timer);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until after hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 relative">
        <svg width="260" height="260" viewBox="0 0 260 260">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          <g transform="translate(130,130)">
            <circle
              r={110}
              fill="transparent"
              stroke="#0f1724"
              strokeWidth="18"
              className="opacity-40"
            />
            <circle
              r={110}
              fill="transparent"
              stroke="#1f2937"
              strokeWidth="12"
              className="opacity-30"
            />
            <circle
              r={110}
              fill="transparent"
              stroke="url(#g1)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={691.15}
              strokeDashoffset={0}
              transform="rotate(-90)"
            />
          </g>
        </svg>

        <div className="absolute">
          <div className="text-center">
            <div className="text-6xl font-semibold leading-tight text-white select-none">
              25:00
            </div>
            <div className="mt-2 text-sm text-gray-300">FOCUS</div>
          </div>
        </div>
      </div>
    );
  }

  // After hydration, use actual timer state
  const displaySeconds = timerState.remainingSeconds;
  const displayMode = timerState.mode;
  const displayDuration = timerState.durationSeconds;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress =
    displayMode === "stopwatch"
      ? Math.min(1, displaySeconds / Math.max(1, displayDuration || 1))
      : displayDuration
      ? (displayDuration - displaySeconds) / displayDuration
      : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 relative">
      <svg width="260" height="260" viewBox="0 0 260 260">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        <g transform="translate(130,130)">
          <circle
            r={radius}
            fill="transparent"
            stroke="#0f1724"
            strokeWidth="18"
            className="opacity-40"
          />
          <circle
            r={radius}
            fill="transparent"
            stroke="#1f2937"
            strokeWidth="12"
            className="opacity-30"
          />
          <circle
            r={radius}
            fill="transparent"
            stroke="url(#g1)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90)"
            style={{ transition: "stroke-dashoffset 300ms linear" }}
          />
        </g>
      </svg>

      <div className="absolute">
        <div className="text-center">
          <div className="text-6xl font-semibold leading-tight text-white select-none">
            {formatTime(displaySeconds)}
          </div>
          <div className="mt-2 text-sm text-gray-300">
            {displayMode.replace("_", " ").toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
