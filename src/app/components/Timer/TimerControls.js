import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  start,
  pause,
  reset,
  setCustomDuration,
} from "../../store/timerSlice";
import { TIMER_MODES } from "../../store/timerSlice";
import { sendNotification, vibrate } from "../../lib/notify";

export default function TimerControls() {
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const timerState = useSelector((s) => s.timer);
  const { enabled: notificationsEnabled } = useSelector(
    (s) => s.notifications || { enabled: false }
  );

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
    <div className="mx-auto p-4 flex flex-col gap-4 backdrop-blur-lg bg-white/10 border-2 border-white/20 rounded-lg">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => dispatch(setMode("pomodoro"))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition shadow-sm border ${
            mode === "pomodoro"
              ? "bg-blue-100 text-blue-600 border-blue-200 shadow-md"
              : "bg-gray-800 text-gray-300 border-gray-700"
          }`}
        >
          <span className="text-sm font-medium">Pomodoro</span>
        </button>

        <button
          onClick={() => dispatch(setMode("short_break"))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition shadow-sm border ${
            mode === "short_break"
              ? "bg-blue-100 text-blue-600 border-blue-200 shadow-md"
              : "bg-gray-800 text-gray-300 border-gray-700"
          }`}
        >
          <span className="text-sm font-medium">Short Break</span>
        </button>

        <button
          onClick={() => dispatch(setMode("long_break"))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition shadow-sm border ${
            mode === "long_break"
              ? "bg-blue-100 text-blue-600 border-blue-200 shadow-md"
              : "bg-gray-800 text-gray-300 border-gray-700"
          }`}
        >
          <span className="text-sm font-medium">Long Break</span>
        </button>

        <button
          onClick={() => dispatch(setMode("countdown"))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition shadow-sm border ${
            mode === "countdown"
              ? "bg-blue-100 text-blue-600 border-blue-200 shadow-md"
              : "bg-gray-800 text-gray-300 border-gray-700"
          }`}
        >
          <span className="text-sm font-medium">Countdown</span>
        </button>

        <button
          onClick={() => dispatch(setMode("stopwatch"))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition shadow-sm border  ${
            mode === "stopwatch"
              ? "bg-blue-100 text-blue-600 border-blue-200 shadow-md"
              : "bg-gray-800 text-gray-300 border-gray-700"
          }`}
        >
          <span className="text-sm font-medium">Stopwatch</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4">
        {!running ? (
          <button
            onClick={() => {
              dispatch(start());
              // Vibrate on button press for tactile feedback
              vibrate([100, 50, 100]);
              if (notificationsEnabled) {
                sendNotification("Focus started", {
                  body: "Good luck — focus on your session!",
                  autoCloseMs: 5000,
                  vibrationPattern: [200, 100, 200],
                });
              }
            }}
            className="flex items-center justify-center px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-sm border border-emerald-600"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => dispatch(pause())}
            className="flex items-center justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-sm border border-yellow-600"
          >
            Pause
          </button>
        )}

        <button
          onClick={() => dispatch(reset())}
          className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-100 text-white hover:text-black rounded-full shadow-sm border border-gray-600"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-center gap-3">
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
          className="flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-sm border border-indigo-600"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
