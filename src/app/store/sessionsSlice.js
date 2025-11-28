// src/store/sessionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveSessionToDB, getAllSessions } from "../lib/db";
import { format } from "date-fns";

export const saveSession = createAsyncThunk(
  "sessions/saveSession",
  async (session, thunkAPI) => {
    // Add a date string
    const s = {
      ...session,
      date: format(new Date(session.startTs || Date.now()), "yyyy-MM-dd"),
      id: session.id || crypto?.randomUUID?.() || `${Date.now()}`,
    };
    const saved = await saveSessionToDB(s);
    return saved;
  }
);

export const loadSessions = createAsyncThunk("sessions/load", async () => {
  const all = await getAllSessions();
  return all;
});

const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearAll(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSession.pending, (state) => {
        state.status = "saving";
      })
      .addCase(saveSession.fulfilled, (state, action) => {
        state.status = "idle";
        state.items.push(action.payload);
      })
      .addCase(saveSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loadSessions.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearAll } = sessionsSlice.actions;
export default sessionsSlice.reducer;
