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
    } else {
      dispatch(setEnabled(false));
      alert(
        "Notification was not granted. You can enable it in your browser settings."
      );
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
