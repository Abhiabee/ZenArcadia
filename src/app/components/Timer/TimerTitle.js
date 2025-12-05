"use client";
import { useEffect } from "react";
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

export default function TimerTitle() {
  const timerState = useSelector((state) => state.timer);

  useEffect(() => {
    if (!timerState.isHydrated) {
      return;
    }

    const displaySeconds = timerState.remainingSeconds;
    const displayMode = timerState.mode;
    const running = timerState.running;

    if (running) {
      // Show timer and mode in title when running
      const timeStr = formatTime(displaySeconds);
      const modeStr = displayMode.replace("_", " ").toUpperCase();
      document.title = `${timeStr} - ${modeStr} | Zen Arcadia`;
    } else {
      // Show default title when not running
      document.title = "Zen Arcadia";
    }

    return () => {
      document.title = "Zen Arcadia";
    };
  }, [
    timerState.remainingSeconds,
    timerState.mode,
    timerState.running,
    timerState.isHydrated,
  ]);

  return null;
}
