"use client";
import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeMute } from "react-icons/fa";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";

export default function SoundTrackRow({
  track,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onSolo,
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During hydration, use a neutral className to prevent mismatch
  const playButtonClass = isHydrated
    ? `px-3 py-2 rounded ${
        track.playing
          ? "bg-emerald-500 text-white"
          : "bg-gray-800 text-gray-200"
      }`
    : "px-3 py-2 rounded bg-gray-800 text-gray-200";

  const muteButtonClass = isHydrated
    ? `px-2 py-1 rounded ${
        track.muted ? "bg-red-500 text-white" : "bg-gray-700 text-gray-200"
      }`
    : "px-2 py-1 rounded bg-gray-700 text-gray-200";

  return (
    <div className="flex items-center gap-3 p-2 w-full">
      <div>
        <button
          onClick={() => onTogglePlay(track.id)}
          className={playButtonClass}
        >
          {isHydrated && track.playing ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{track.name}</div>
          <div className="text-xs text-gray-400">
            {Math.round(track.volume * 100)}%
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={track.volume}
          onChange={(e) => onVolumeChange(track.id, Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleMute(track.id)}
          className={muteButtonClass}
          title="Mute"
        >
          {isHydrated && track.muted ? (
            <ImVolumeMute size={24} />
          ) : (
            <ImVolumeMute2 size={24} />
          )}
        </button>
      </div>
    </div>
  );
}
