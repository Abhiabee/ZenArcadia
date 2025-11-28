// src/components/Timer/TimerControls.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  start,
  pause,
  reset,
  setCustomDuration,
} from "../../store/timerSlice";
import { TIMER_MODES } from "../../store/timerSlice"; // adjust import path if needed

export default function TimerControls() {
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const timerState = useSelector((s) => s.timer);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use consistent defaults during SSR and initial render
  const mode = isMounted ? timerState.mode : "pomodoro";
  const running = isMounted ? timerState.running : false;
  const presets = isMounted
    ? timerState.presets
    : { pomodoro: 1500, short_break: 300, long_break: 900 };

  const [customMinutes, setCustomMinutes] = useState(
    Math.round((presets[mode] || 1500) / 60)
  );

  function applyCustom() {
    const secs = Math.max(1, Math.floor(Number(customMinutes) * 60));
    dispatch(setCustomDuration(secs));
  }

  return (
    <div className="w-full mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => dispatch(setMode("pomodoro"))}
          className={`px-3 py-2 rounded-md transition ${
            mode === "pomodoro"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Pomodoro
        </button>

        <button
          onClick={() => dispatch(setMode("short_break"))}
          className={`px-3 py-2 rounded-md transition ${
            mode === "short_break"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Short Break
        </button>

        <button
          onClick={() => dispatch(setMode("long_break"))}
          className={`px-3 py-2 rounded-md transition ${
            mode === "long_break"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Long Break
        </button>

        <button
          onClick={() => dispatch(setMode("countdown"))}
          className={`px-3 py-2 rounded-md transition ${
            mode === "countdown"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Countdown
        </button>

        <button
          onClick={() => dispatch(setMode("stopwatch"))}
          className={`px-3 py-2 rounded-md transition ${
            mode === "stopwatch"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Stopwatch
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        {!running ? (
          <button
            onClick={() => dispatch(start())}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => dispatch(pause())}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
          >
            Pause
          </button>
        )}

        <button
          onClick={() => dispatch(reset())}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <label className="text-sm text-gray-300">Custom minutes</label>
        <input
          type="number"
          min="1"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          className="w-20 px-2 py-1 rounded bg-gray-900 text-white outline-none"
        />
        <button
          onClick={applyCustom}
          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
