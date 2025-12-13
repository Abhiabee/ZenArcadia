export async function requestNotificationPermission() {
  if (typeof window === "undefined") return "denied";

  // Check if Notification API is supported
  if (!("Notification" in window)) {
    console.warn("Notification API not supported in this browser");
    return "unsupported";
  }

  // If already granted, return early
  if (Notification.permission === "granted") {
    return "granted";
  }

  // If already denied, return early
  if (Notification.permission === "denied") {
    console.warn("Notification permission already denied by user");
    return "denied";
  }

  // Permission is "default" - ask user
  try {
    const result = await Notification.requestPermission();
    console.log("Notification permission result:", result);
    return result; // "granted" | "denied"
  } catch (e) {
    console.error("requestNotificationPermission error:", e);
    return "denied";
  }
}

export function canNotify() {
  if (typeof window === "undefined") return false;
  return "Notification" in window && Notification.permission === "granted";
}

export function sendNotification(title, options = {}) {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;
  try {
    if (Notification.permission === "granted") {
      const n = new Notification(title, options);

      // Trigger vibration on mobile when notification is sent
      const vibrationPattern = options.vibrationPattern || [200, 100, 200];
      if (options.vibrate !== false) {
        vibrate(vibrationPattern);
      }

      if (!options.persistent) {
        setTimeout(() => {
          try {
            n.close();
          } catch {}
        }, options.autoCloseMs || 8000);
      }
      return n;
    } else {
      console.warn(
        "Notification permission not granted:",
        Notification.permission
      );
      return null;
    }
  } catch (e) {
    console.error("sendNotification error", e);
    return null;
  }
}

/** Vibrate pattern if supported (mobile) */
export function vibrate(pattern = [200, 100, 200]) {
  if (typeof navigator === "undefined") return;
  try {
    if ("vibrate" in navigator && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    console.error("vibrate error", e);
  }
}
