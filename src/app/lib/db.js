import localforage from "localforage";

const SESSIONS_KEY = "focus:sessions";

localforage.config({
  name: "ZenArcadia",
  storeName: "zenarcadia_store",
});

export async function getAllSessions() {
  try {
    const all = (await localforage.getItem(SESSIONS_KEY)) || [];
    return all;
  } catch (e) {
    console.error("getAllSessions", e);
    return [];
  }
}

export async function saveSessionToDB(session) {
  try {
    const arr = (await localforage.getItem(SESSIONS_KEY)) || [];
    arr.push(session);
    await localforage.setItem(SESSIONS_KEY, arr);
    return session;
  } catch (e) {
    console.error("saveSessionToDB", e);
    throw e;
  }
}

export async function clearSessions() {
  return localforage.removeItem(SESSIONS_KEY);
}
