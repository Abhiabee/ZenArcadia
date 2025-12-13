"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { requestNotificationPermission, canNotify } from "../../lib/notify";
import { readStorage } from "../../lib/storage";
import { setEnabled, setLastAsked } from "../../store/notificationsSlice";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";

export default function NotificationsToggle() {
  const dispatch = useDispatch();
  const enabled = useSelector((s) => s.notifications?.enabled);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const persisted = readStorage("focus:notifications");
    if (persisted && persisted.enabled) {
      dispatch(setEnabled(persisted.enabled));
    }
    setIsMounted(true);
  }, [dispatch]);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  async function handleToggle() {
    if (enabled) {
      dispatch(setEnabled(false));
      return;
    }

    setLoading(true);
    const result = await requestNotificationPermission();
    setLoading(false);
    dispatch(setLastAsked(Date.now()));

    if (result === "granted") {
      dispatch(setEnabled(true));
    } else if (result === "unsupported") {
      // Notifications not supported on this device
      let message = "Notifications are not supported in your browser.";

      if (isIOS()) {
        message =
          "iOS doesn't support web push notifications. " +
          "You can add this app to your home screen and notifications may work differently.\n\n" +
          "Go to Safari menu → Add to Home Screen to use as app.";
      } else if (isMobileDevice()) {
        message =
          "Notifications may not be fully supported on this device. " +
          "Try using the app via home screen shortcut or a different browser.";
      }

      alert(message);
      dispatch(setEnabled(false));
    } else if (result === "denied") {
      // User explicitly denied
      let message =
        "Notifications were blocked. Enable them in your browser settings.\n\n";

      if (isIOS()) {
        message +=
          "Go to iPhone Settings → Safari → Notifications → allow notifications.";
      } else if (isMobileDevice()) {
        message += "Go to your browser settings and enable notifications.";
      } else {
        message +=
          "Click the lock icon in the address bar to change notification settings.";
      }

      alert(message);
      dispatch(setEnabled(false));
    }
  }

  if (!isMounted) {
    return null; // avoid hydration mismatch
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-3 rounded-full transition-all duration-200 ${
        enabled
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50"
          : "backdrop-blur-lg bg-white/10 text-gray-300 hover:bg-gray-700"
      }`}
      title={enabled ? "Notifications enabled" : "Enable notifications"}
    >
      {enabled ? (
        <IoNotifications size={24} />
      ) : (
        <IoNotificationsOutline size={24} />
      )}
    </button>
  );
}
