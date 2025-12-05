import { createSlice } from "@reduxjs/toolkit";
import { readStorage } from "../lib/storage";
import { DEFAULT_THEMES } from "../lib/themes";

const STORAGE_KEY = "focus:theme";

const persisted = readStorage(STORAGE_KEY, null);

const initialState = persisted || {
  themes: DEFAULT_THEMES,
  selectedId: DEFAULT_THEMES[0].id,
  darkMode: false,
};

// Export action types for middleware
export const THEME_SLICE_ACTIONS = [
  "theme/selectTheme",
  "theme/addTheme",
  "theme/setDarkMode",
];

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    selectTheme(state, action) {
      state.selectedId = action.payload;
    },
    addTheme(state, action) {
      state.themes.push(action.payload);
    },
    setDarkMode(state, action) {
      state.darkMode = !!action.payload;
    },
    loadThemes(state, action) {
      const data = action.payload;
      if (data?.themes) state.themes = data.themes;
      if (data?.selectedId) state.selectedId = data.selectedId;
      if (typeof data?.darkMode === "boolean") state.darkMode = data.darkMode;
    },
  },
});

export const { selectTheme, addTheme, setDarkMode, loadThemes } =
  themeSlice.actions;
export default themeSlice.reducer;
