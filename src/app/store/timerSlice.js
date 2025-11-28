// src/store/timerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { readStorage } from "../lib/storage";

const STORAGE_KEY = "timerState";

export const TIMER_MODES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "short_break",
  LONG_BREAK: "long_break",
  COUNTDOWN: "countdown",
  STOPWATCH: "stopwatch",
};

const DEFAULTS = {
  pomodoro: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

// Don't read from storage during SSR - will be handled client-side
const initial = {
  mode: TIMER_MODES.POMODORO,
  durationSeconds: DEFAULTS.pomodoro,
  remainingSeconds: DEFAULTS.pomodoro,
  running: false,
  startTimestamp: null,
  pausedAt: null,
  presets: { ...DEFAULTS },
  lastEnded: null,
  isHydrated: false, // Track if we've loaded from localStorage
};

const timerSlice = createSlice({
  name: "timer",
  initialState: initial,
  reducers: {
    setMode(state, action) {
      const mode = action.payload;
      state.mode = mode;

      if (mode === TIMER_MODES.STOPWATCH) {
        // Stopwatch starts at 0 and counts up
        state.durationSeconds = 0;
        state.remainingSeconds = 0;
      } else {
        // Other modes use preset durations and count down
        const duration = state.presets[mode] ?? state.durationSeconds;
        state.durationSeconds = duration;
        state.remainingSeconds = duration;
      }

      state.running = false;
      state.startTimestamp = null;
      state.pausedAt = null;
    },
    setCustomDuration(state, action) {
      const seconds = action.payload;
      state.durationSeconds = seconds;
      state.remainingSeconds = seconds;
    },
    start(state) {
      const now = Date.now();
      state.running = true;

      if (state.pausedAt) {
        // Resuming from pause - calculate new start timestamp based on remaining time
        if (state.mode === TIMER_MODES.STOPWATCH) {
          // For stopwatch, adjust start time so current display time continues
          const elapsedTime = state.remainingSeconds; // remainingSeconds holds elapsed time for stopwatch
          state.startTimestamp = now - elapsedTime * 1000;
        } else {
          // For countdown timers, adjust start time so remaining time is preserved
          const elapsedBeforePause =
            state.durationSeconds - state.remainingSeconds;
          state.startTimestamp = now - elapsedBeforePause * 1000;
        }
      } else {
        // Starting fresh
        state.startTimestamp = now;
        if (state.mode === TIMER_MODES.STOPWATCH) {
          state.remainingSeconds = 0; // Ensure stopwatch starts at 0
        }
      }

      state.pausedAt = null;
    },
    pause(state) {
      if (!state.running) return;
      const now = Date.now();
      let remaining = state.remainingSeconds;
      if (state.mode === TIMER_MODES.STOPWATCH && state.startTimestamp) {
        // For stopwatch, calculate elapsed time from start
        const elapsed = Math.round((now - state.startTimestamp) / 1000);
        remaining = elapsed; // remainingSeconds holds elapsed time for stopwatch
      } else if (state.startTimestamp) {
        const elapsed = Math.round((now - state.startTimestamp) / 1000);
        remaining = state.durationSeconds - elapsed;
        if (remaining < 0) remaining = 0;
      }
      state.running = false;
      state.remainingSeconds = remaining;
      state.pausedAt = now;
      state.startTimestamp = null;
    },
    reset(state) {
      state.running = false;

      if (state.mode === TIMER_MODES.STOPWATCH) {
        // Stopwatch resets to 0
        state.durationSeconds = 0;
        state.remainingSeconds = 0;
      } else {
        // Other modes reset to their preset duration
        const duration = state.presets[state.mode] ?? state.durationSeconds;
        state.durationSeconds = duration;
        state.remainingSeconds = duration;
      }

      state.startTimestamp = null;
      state.pausedAt = null;
    },
    tickUpdate(state, action) {
      state.remainingSeconds = action.payload;
    },
    setPreset(state, action) {
      const { mode, seconds } = action.payload;
      state.presets[mode] = seconds;
      if (state.mode === mode && !state.running) {
        state.durationSeconds = seconds;
        state.remainingSeconds = mode === TIMER_MODES.STOPWATCH ? 0 : seconds;
      }
    },
    markEnded(state, action) {
      state.running = false;
      state.startTimestamp = null;
      state.pausedAt = null;
      state.remainingSeconds =
        state.mode === TIMER_MODES.STOPWATCH ? state.durationSeconds : 0;
      state.lastEnded = action.payload || Date.now();
    },
    hydrate(state, action) {
      // Client-side hydration from localStorage
      const persisted = action.payload;
      if (persisted && typeof persisted === "object") {
        // Restore persisted state
        Object.assign(state, persisted);

        // Recalculate time if timer was running
        if (state.running && state.startTimestamp) {
          const now = Date.now();
          const elapsed = Math.round((now - state.startTimestamp) / 1000);
          if (state.mode === TIMER_MODES.STOPWATCH) {
            state.remainingSeconds = elapsed;
          } else {
            const rem = state.durationSeconds - elapsed;
            state.remainingSeconds = rem > 0 ? rem : 0;
            if (rem <= 0) {
              state.running = false;
              state.startTimestamp = null;
            }
          }
        }
      }
      state.isHydrated = true;
    },
  },
});

export const {
  setMode,
  setCustomDuration,
  start,
  pause,
  reset,
  tickUpdate,
  setPreset,
  markEnded,
  hydrate,
} = timerSlice.actions;

export default timerSlice.reducer;
