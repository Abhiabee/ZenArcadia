import { createSlice } from "@reduxjs/toolkit";
import { readStorage, writeStorage } from "../lib/storage";

const STORAGE_KEY = "focus:notifications";

const persisted = readStorage(STORAGE_KEY, null);

const initialState = persisted || {
  enabled: false,
  lastAsked: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setEnabled(state, action) {
      state.enabled = !!action.payload;
      state.lastAsked = state.lastAsked ?? Date.now();
      // Save to localStorage immediately
      const plainState = {
        enabled: state.enabled,
        lastAsked: state.lastAsked,
      };
      writeStorage(STORAGE_KEY, plainState);
    },
    setLastAsked(state, action) {
      state.lastAsked = action.payload;
      // Save to localStorage immediately
      const plainState = {
        enabled: state.enabled,
        lastAsked: state.lastAsked,
      };
      writeStorage(STORAGE_KEY, plainState);
    },
  },
});

export const { setEnabled, setLastAsked } = notificationsSlice.actions;
export default notificationsSlice.reducer;
