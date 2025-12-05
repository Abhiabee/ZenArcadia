import localforage from "localforage";

const TASKS_KEY = "focus:tasks";

localforage.config({
  name: "ZenArcadia",
  storeName: "zenarcadia_store",
});

export async function getAllTasks() {
  try {
    const arr = (await localforage.getItem(TASKS_KEY)) || [];
    return arr;
  } catch (e) {
    console.error("getAllTasks", e);
    return [];
  }
}

export async function saveAllTasks(tasks) {
  try {
    await localforage.setItem(TASKS_KEY, tasks);
    return tasks;
  } catch (e) {
    console.error("saveAllTasks", e);
    throw e;
  }
}

export async function clearTasks() {
  try {
    await localforage.removeItem(TASKS_KEY);
  } catch (e) {
    console.error("clearTasks", e);
  }
}
