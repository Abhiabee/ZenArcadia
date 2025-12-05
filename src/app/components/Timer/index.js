import React, { useEffect, useRef } from "react";
import TimerDisplay from "./TimerDisplay";
import TimerHydration from "../TimerHydration";
import TimerTitle from "./TimerTitle";
import { useSelector, useDispatch } from "react-redux";
import { tickUpdate, pause, markEnded } from "../../store/timerSlice";
import { saveSession } from "../../store/sessionsSlice";
import { debouncedWriter } from "../../lib/storage";

const persist = debouncedWriter("timerState", 600);

export default function Timer() {
  const dispatch = useDispatch();
  const timer = useSelector((s) => s.timer);
  const rafRef = useRef(null);
  const timerRef = useRef(timer);

  // CRITICAL: Update timerRef FIRST and synchronously
  timerRef.current = timer;

  // Memoize tick function to prevent RAF from holding stale references
  const tick = React.useCallback(() => {
    const now = Date.now();
    const store = timerRef.current;

    if (!store.running || !store.startTimestamp) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    if (store.mode === "stopwatch") {
      const elapsed = Math.round((now - store.startTimestamp) / 1000);
      dispatch(tickUpdate(elapsed));
    } else {
      const elapsed = Math.round((now - store.startTimestamp) / 1000);
      const rem = store.durationSeconds - elapsed;
      const remaining = rem > 0 ? rem : 0;
      dispatch(tickUpdate(remaining));
      if (rem <= 0) {
        const session = {
          mode: store.mode,
          startTs: store.startTimestamp,
          endTs: now,
          duration: store.durationSeconds,
        };
        dispatch(markEnded(now));
        dispatch(saveSession(session));
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [dispatch]);

  // Persist after timerRef is updated
  useEffect(() => {
    persist(timer);
  }, [timer]);

  // Start/stop RAF loop
  useEffect(() => {
    if (timer.running && !rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (!timer.running && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [timer.running, timer.startTimestamp, timer.isHydrated, tick]);

  return (
    <div className="flex flex-col items-center gap-6">
      <TimerHydration />
      <TimerTitle />
      <TimerDisplay />
    </div>
  );
}
