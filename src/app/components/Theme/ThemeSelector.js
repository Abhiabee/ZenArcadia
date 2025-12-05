"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ThemeThumbnail from "./ThemeThumbnail";
import { selectTheme } from "../../store/themeSlice";

export default function ThemeSelector() {
  const [isHydrated, setIsHydrated] = useState(false);
  const dispatch = useDispatch();
  const themeState = useSelector((s) => s.theme);
  const themes = themeState?.themes || [];
  const selectedId = themeState?.selectedId;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  function handleSelect(id) {
    const result = dispatch(selectTheme(id));
  }

  if (!isHydrated) {
    return <div className="space-y-4">Loading themes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-min">
          {themes.map((t) => (
            <div key={t.id} className="flex-shrink-0">
              <ThemeThumbnail
                theme={t}
                selected={t.id === selectedId}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
