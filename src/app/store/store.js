import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timerSlice";
import sessionsReducer from "./sessionsSlice";
import audioReducer, { AUDIO_SLICE_ACTIONS } from "./audioSlice";
import themeReducer, { THEME_SLICE_ACTIONS } from "./themeSlice";
import tasksReducer from "./tasksSlice";
import { debouncedWriter } from "../lib/storage";

// Create debounced saves
const audioSave = debouncedWriter("focus:sounds", 500);
const themeSave = debouncedWriter("focus:theme", 300);

// Middleware to persist audio state changes
const audioPersistedMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // After audio actions complete, save the new state
  if (AUDIO_SLICE_ACTIONS.includes(action.type)) {
    const state = store.getState().audio;
    if (state) {
      audioSave(state);
    }
  }
  return result;
};

// Middleware to persist theme state changes
const themePersistedMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // After theme actions complete, save the new state
  if (THEME_SLICE_ACTIONS.includes(action.type)) {
    const state = store.getState().theme;
    if (state) {
      themeSave(state);
    }
  }
  return result;
};

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    sessions: sessionsReducer,
    audio: audioReducer,
    theme: themeReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      audioPersistedMiddleware,
      themePersistedMiddleware
    ),
});

export default store;
