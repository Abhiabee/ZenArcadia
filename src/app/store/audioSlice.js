import { createSlice } from "@reduxjs/toolkit";
import { readStorage, writeStorage, debouncedWriter } from "../lib/storage";

const STORAGE_KEY = "focus:sounds";

// default configuration (must match audio manager's default ids)
const DEFAULT_STATE = {
  tracks: [
    {
      id: "rain",
      name: "Rain",
      src: "/sounds/rain.mp3",
      volume: 0.6,
      playing: false,
      muted: false,
      solo: false,
    },
    {
      id: "beach",
      name: "Beach",
      src: "/sounds/beach.mp3",
      volume: 0.6,
      playing: false,
      muted: false,
      solo: false,
    },
    {
      id: "night",
      name: "Night",
      src: "/sounds/night.mp3",
      volume: 0.5,
      playing: false,
      muted: false,
      solo: false,
    },
    {
      id: "forest",
      name: "Forest",
      src: "/sounds/forest.mp3",
      volume: 0.5,
      playing: false,
      muted: false,
      solo: false,
    },
  ],
  masterVolume: 1,
};

const persisted = readStorage(STORAGE_KEY, null);
const initial = persisted || DEFAULT_STATE;

// debounce persister - will be called via middleware
const save = debouncedWriter(STORAGE_KEY, 500);

// Action to trigger saves (used by middleware)
export const AUDIO_SLICE_ACTIONS = [
  "audio/setTracks",
  "audio/togglePlay",
  "audio/setVolume",
  "audio/toggleMute",
  "audio/setSolo",
  "audio/setMasterVolume",
];

const audioSlice = createSlice({
  name: "audio",
  initialState: initial,
  reducers: {
    setTracks(state, action) {
      state.tracks = action.payload;
    },
    togglePlay(state, action) {
      const id = action.payload;
      const t = state.tracks.find((x) => x.id === id);
      if (!t) return;
      t.playing = !t.playing;
      // if playing becomes true, ensure muted=false
      if (t.playing) t.muted = false;
    },
    setVolume(state, action) {
      const { id, volume } = action.payload;
      const t = state.tracks.find((x) => x.id === id);
      if (!t) return;
      t.volume = Math.max(0, Math.min(1, volume));
    },
    toggleMute(state, action) {
      const id = action.payload;
      const t = state.tracks.find((x) => x.id === id);
      if (!t) return;
      t.muted = !t.muted;
      // if muted, set playing false
      if (t.muted) t.playing = false;
    },
    setSolo(state, action) {
      const id = action.payload;
      state.tracks.forEach((t) => {
        t.solo = t.id === id ? !t.solo : false;
      });
    },
    setMasterVolume(state, action) {
      state.masterVolume = Math.max(0, Math.min(1, action.payload));
    },
    loadFromStorage(state, action) {
      const data = action.payload;
      if (data && data.tracks) {
        state.tracks = data.tracks;
      }
      if (data && typeof data.masterVolume === "number")
        state.masterVolume = data.masterVolume;
    },
  },
});

export const {
  setTracks,
  togglePlay,
  setVolume,
  toggleMute,
  setSolo,
  setMasterVolume,
  loadFromStorage,
} = audioSlice.actions;
export default audioSlice.reducer;
