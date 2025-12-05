import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTasks, saveAllTasks } from "../lib/tasksDB";
import { v4 as uuidv4 } from "uuid";

export const loadTasks = createAsyncThunk("tasks/load", async () => {
  const all = await getAllTasks();
  return all;
});

export const addTask = createAsyncThunk(
  "tasks/add",
  async (payload, thunkAPI) => {
    const { title = "", notes = "" } = payload || {};
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      notes: notes || "",
      completed: false,
      createdAt: Date.now(),
      priority: false,
    };
    const state = thunkAPI.getState();
    const next = [...state.tasks.items, newTask];
    await saveAllTasks(next);
    return newTask;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (task, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = state.tasks.items.map((t) =>
      t.id === task.id ? { ...t, ...task } : t
    );
    await saveAllTasks(items);
    return task;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = state.tasks.items.filter((t) => t.id !== id);
    await saveAllTasks(items);
    return id;
  }
);

export const toggleComplete = createAsyncThunk(
  "tasks/toggleComplete",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = state.tasks.items.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    await saveAllTasks(items);
    return id;
  }
);

export const setPriority = createAsyncThunk(
  "tasks/setPriority",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    // single priority: clear others
    const items = state.tasks.items.map((t) => ({
      ...t,
      priority: t.id === id ? !t.priority : false,
    }));
    await saveAllTasks(items);
    return id;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // local synchronous reducers if needed
    clearAllTasksLocally(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.status = "idle";
      })
      .addCase(loadTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(toggleComplete.fulfilled, (state, action) => {
        state.items = state.items.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        );
      })
      .addCase(setPriority.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.map((t) => ({
          ...t,
          priority: t.id === id ? !t.priority : false,
        }));
      });
  },
});

export const { clearAllTasksLocally } = tasksSlice.actions;
export default tasksSlice.reducer;
