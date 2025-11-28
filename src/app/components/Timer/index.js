// src/components/Timer/index.js
import React, { useEffect, useRef } from "react";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import TimerHydration from "../TimerHydration";
import { useSelector, useDispatch } from "react-redux";
import { tickUpdate, pause, markEnded } from "../../store/timerSlice";
import { saveSession } from "../../store/sessionsSlice";
import { debouncedWriter } from "../../lib/storage";

const persist = debouncedWriter("timerState", 600);

export default function Timer() {
  const dispatch = useDispatch();
  const timer = useSelector((s) => s.timer);
  const rafRef = useRef(null);

  function tick() {
    const t = timer; // capture snapshot (we'll read fresh via store below)
    const now = Date.now();
    // We read the latest state from Redux directly to avoid stale closure.
    const state = window.__ZR_TIMER_STATE__
      ? window.__ZR_TIMER_STATE__()
      : null;
    // fallback: use timer in closure (acceptable but less fresh)
    const store = state || timer;

    if (!store.running || !store.startTimestamp) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    if (store.mode === "stopwatch") {
      const elapsed = Math.round((now - store.startTimestamp) / 1000);
      const val = store.durationSeconds + elapsed;
      dispatch(tickUpdate(val));
    } else {
      const elapsed = Math.round((now - store.startTimestamp) / 1000);
      const rem = store.durationSeconds - elapsed;
      const remaining = rem > 0 ? rem : 0;
      dispatch(tickUpdate(remaining));
      if (rem <= 0) {
        // session finished
        // create session object and dispatch saveSession
        const session = {
          mode: store.mode,
          startTs: store.startTimestamp,
          endTs: now,
          duration: store.durationSeconds,
          // taskId: null // attach if you have an active task
        };
        dispatch(markEnded(now)); // updates timer slice
        dispatch(saveSession(session)); // async save to IndexedDB
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  // helper to get freshest state from Redux store (avoid stale closures)
  useEffect(() => {
    // install a getter on window used by tick closure
    // eslint-disable-next-line no-underscore-dangle
    window.__ZR_TIMER_STATE__ = () => {
      return { ...storeSnapshot() };
    };

    function storeSnapshot() {
      // crude but works: read from DOM via Redux devtools? Instead re-import store
      try {
        // We'll try to import the store (works in same bundle)
        // eslint-disable-next-line global-require
        const { store } = require("../../store/store");
        return store.getState().timer;
      } catch (e) {
        return null;
      }
    }

    return () => {
      // cleanup
      // eslint-disable-next-line no-underscore-dangle
      delete window.__ZR_TIMER_STATE__;
    };
  }, []);

  // watch running to start/stop RAF
  useEffect(() => {
    if (timer.running && !rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (!timer.running && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // persist timer slice to localStorage (debounced)
    persist(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timer.running,
    timer.startTimestamp,
    timer.durationSeconds,
    timer.mode,
    timer.remainingSeconds,
  ]);

  // visibility handler to re-sync on tab focus
  useEffect(() => {
    function onVis() {
      if (
        document.visibilityState === "visible" &&
        timer.running &&
        timer.startTimestamp
      ) {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.running, timer.startTimestamp]);

  // initial mount: if timer already running, start RAF
  useEffect(() => {
    if (timer.running && !rafRef.current)
      rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <TimerHydration />
      <TimerDisplay />
      <TimerControls />
    </div>
  );
}
