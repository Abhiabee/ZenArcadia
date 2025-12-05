const PREFIX = "zenarcadia:";

function safeSerialize(value, seen = new WeakSet()) {
  try {
    if (value === null) return null;
    const t = typeof value;
    if (t === "string" || t === "number" || t === "boolean") return value;
    if (t === "bigint") return value.toString();
    if (t === "function" || t === "symbol" || t === "undefined")
      return undefined;
  } catch (e) {
    return String(value);
  }

  // guard object handling
  // detect circular early
  try {
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
  } catch (e) {
    try {
      return String(value);
    } catch {
      return null;
    }
  }

  // ARRAY (guarded)
  try {
    if (Array.isArray(value)) {
      const arr = [];
      for (let i = 0; i < value.length; i += 1) {
        try {
          arr.push(safeSerialize(value[i], seen));
        } catch {
          arr.push(null);
        }
      }
      try {
        seen.delete(value);
      } catch {}
      return arr;
    }
  } catch (e) {
    // Array.isArray threw (likely revoked proxy). Fallback:
    try {
      const s = String(value);
      try {
        seen.delete(value);
      } catch {}
      return s;
    } catch {
      try {
        seen.delete(value);
      } catch {}
      return null;
    }
  }

  // PLAIN OBJECT (guarded)
  try {
    let keys;
    try {
      keys = Object.keys(value);
    } catch (e) {
      // Object.keys might throw on exotic objects -> fallback to String()
      const s = String(value);
      try {
        seen.delete(value);
      } catch {}
      return s;
    }

    const out = {};
    for (const key of keys) {
      try {
        const v = value[key];
        const sv = safeSerialize(v, seen);
        if (sv !== undefined) out[key] = sv;
      } catch (e) {
        // property access threw — skip or set null to preserve shape
        out[key] = null;
      }
    }
    try {
      seen.delete(value);
    } catch {}
    return out;
  } catch (e) {
    // last-resort fallback: try to convert to string
    try {
      const s = String(value);
      try {
        seen.delete(value);
      } catch {}
      return s;
    } catch {
      try {
        seen.delete(value);
      } catch {}
      return null;
    }
  }
}

/** read from localStorage - safe in SSR */
export function readStorage(key, fallback = null) {
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

/** write to localStorage - safe in SSR and uses safeSerialize fallback */
export function writeStorage(key, value) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    console.log("writeStorage: skipped - not in browser environment");
    return;
  }

  try {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(PREFIX + key, serialized);
      console.log(
        "writeStorage: successfully wrote",
        PREFIX + key,
        "=>",
        serialized.substring(0, 100)
      );
      return;
    } catch (fastErr) {
      console.log("writeStorage: fast path failed, trying safe serialization");
    }

    // Safe serialize the value into a plain JS structure
    const plain = safeSerialize(value);
    try {
      const serialized = JSON.stringify(plain);
      localStorage.setItem(PREFIX + key, serialized);
      console.log(
        "writeStorage: safely wrote",
        PREFIX + key,
        "=>",
        serialized.substring(0, 100)
      );
      return;
    } catch (finalErr) {
      try {
        localStorage.setItem(PREFIX + key, String(plain));
        console.log("writeStorage: final resort write");
        return;
      } catch (e) {
        console.error("writeStorage - final write failed", e);
        return;
      }
    }
  } catch (e) {
    console.error("writeStorage", e);
  }
}

/** debounced writer factory */
export function debouncedWriter(key, wait = 600) {
  let timeout = null;
  return (value) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      try {
        // Convert Redux proxy to plain object before writing
        const plainValue = safeSerialize(value);
        writeStorage(key, plainValue);
      } finally {
        timeout = null;
      }
    }, wait);
  };
}
