"use client";
import React from "react";

export default function ThemeThumbnail({
  theme,
  selected,
  onSelect,
  onPreview,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(theme.id);
  };

  return (
    <div
      className={`relative w-40 h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
        selected
          ? "ring-4 ring-indigo-400 border-2 border-indigo-400 shadow-lg shadow-indigo-400/50 p-2"
          : "border-2 border-gray-400"
      }`}
      onClick={handleClick}
    >
      <img
        src={theme.src}
        alt={theme.name}
        className="w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{ background: theme.overlay ?? "rgba(0,0,0,0.35)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-black/30">
        {theme.name}
      </div>
    </div>
  );
}
