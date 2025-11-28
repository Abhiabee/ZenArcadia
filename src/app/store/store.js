// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timerSlice";
import sessionsReducer from "./sessionsSlice";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    sessions: sessionsReducer,
  },
});

// Export RootState/Dispatch types if using TS later
export default store;
