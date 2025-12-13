export async function requestNotificationPermission() {
  if (typeof window === "undefined") return "denied";
  if (!("Notification" in window)) return "unsupported";

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (e) {
    console.error("requestNotificationPermission:", e);
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
