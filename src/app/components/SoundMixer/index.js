"use client";
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import AudioManager from "../../lib/audio";
import SoundTrackRow from "./SoundTrackRow";
import {
  togglePlay,
  setVolume,
  toggleMute,
  setSolo,
  setMasterVolume,
  loadFromStorage,
} from "../../store/audioSlice";
import { readStorage } from "../../lib/storage";

const audioManager = AudioManager;

export default function SoundMixer() {
  const dispatch = useDispatch();
  const audioState = useSelector((s) => s.audio);
  const initRef = useRef(false);

  // Initialize AudioManager once on client mount (globally, not per-mount)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      // load persisted config if available
      const persisted = readStorage("focus:sounds", null);
      const tracksConfig =
        persisted && persisted.tracks ? persisted.tracks : null;

      await audioManager.init(tracksConfig || undefined);
      const current = audioManager.getState();
      const srcApplied = (tracksConfig || []).length ? tracksConfig : current;

      (srcApplied || []).forEach((t) => {
        if (t.volume != null) audioManager.setVolume(t.id, t.volume);
        if (t.muted) audioManager.mute(t.id, true);
        if (t.solo) audioManager.setSolo(t.id, true);
        if (t.playing) audioManager.play(t.id);
      });

      // load persisted into redux state (so UI matches)
      if (persisted) {
        dispatch(loadFromStorage(persisted));
      }
    };

    init();
  }, []);

  // When redux audio state changes, sync to Howler manager
  useEffect(() => {
    const mgr = audioManager;
    if (!mgr) return;
    const master = audioState.masterVolume ?? 1;

    audioState.tracks.forEach((t) => {
      // volume scaled by master
      const scaled = Math.max(0, Math.min(1, (t.volume ?? 1) * master));
      mgr.setVolume(t.id, scaled);
      // mute handling
      mgr.mute(t.id, !!t.muted);
    });

    // start/stop playing based on playing flags
    audioState.tracks.forEach((t) => {
      if (t.playing) {
        mgr.play(t.id);
      } else {
        // only pause if the howler reports playing
        if (mgr.trackMeta[t.id]?.playing) mgr.pause(t.id);
      }
    });
  }, [audioState]);

  // handlers wired to redux actions and manager
  const handleTogglePlay = (id) => {
    dispatch(togglePlay(id));
    // manager will be synced by effect above; but we can call manager immediately for snappy response
    const state = audioState.tracks.find((x) => x.id === id);
    if (!state?.playing) {
      audioManager.play(id);
    } else {
      audioManager.pause(id);
    }
  };

  const handleVolume = (id, volume) => {
    dispatch(setVolume({ id, volume }));
    audioManager.setVolume(id, volume * (audioState.masterVolume ?? 1));
  };

  const handleMute = (id) => {
    dispatch(toggleMute(id));
    const t = audioState.tracks.find((x) => x.id === id);
    audioManager.mute(id, !t?.muted);
  };

  const handleMasterVolume = (e) => {
    const v = Number(e.target.value);
    dispatch(setMasterVolume(v));
    audioState.tracks.forEach((t) => {
      audioManager.setVolume(t.id, (t.volume ?? 1) * v);
    });
  };

  return (
    <div className="w-fit max-w-3xl rounded-lg p-4 backdrop-blur-lg bg-white/10 border-2 border-white/20 ">
      <h2 className="text-lg font-semibold mb-3">Ambient Sound Mixer</h2>

      <div className="mb-3">
        <label className="block text-sm text-gray-300">Master Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={audioState.masterVolume ?? 1}
          onChange={handleMasterVolume}
          className="w-full mt-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        {audioState.tracks.map((t) => (
          <SoundTrackRow
            key={t.id}
            track={t}
            onTogglePlay={handleTogglePlay}
            onVolumeChange={handleVolume}
            onToggleMute={handleMute}
          />
        ))}
      </div>
    </div>
  );
}
