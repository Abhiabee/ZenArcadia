// src/components/TimerHydration.js
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrate } from "../store/timerSlice";
import { readStorage } from "../lib/storage";

const STORAGE_KEY = "timerState";

export default function TimerHydration() {
  const dispatch = useDispatch();
  const isHydrated = useSelector((state) => state.timer.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      const persisted = readStorage(STORAGE_KEY, null);
      dispatch(hydrate(persisted));
    }
  }, [dispatch, isHydrated]);

  return null; // This component doesn't render anything
}
