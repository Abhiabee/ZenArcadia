// src/lib/storage.js
const PREFIX = "zenarcadia:";

export function readStorage(key, fallback = null) {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("readStorage", e);
    return fallback;
  }
}

export function writeStorage(key, value) {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("writeStorage", e);
  }
}

export function debouncedWriter(key, wait = 600) {
  let timeout = null;
  return (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      writeStorage(key, value);
    }, wait);
  };
}
