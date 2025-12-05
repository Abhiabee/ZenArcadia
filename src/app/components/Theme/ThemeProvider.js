"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

/**
 * ThemeProvider should wrap app content where you want the background applied.
 * It reads selected theme from Redux and adds a full-screen background div.
 *
 * Usage: wrap your page (or app/layout) children with <ThemeProvider>{children}</ThemeProvider>
 */
export default function ThemeProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [overlayStyle, setOverlayStyle] = useState({});

  const themeState = useSelector((s) => s.theme);
  const selected =
    themeState?.themes?.find((t) => t.id === themeState.selectedId) || null;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update background and overlay when theme changes
  useEffect(() => {
    if (selected) {
      setBackgroundStyle({
        backgroundImage: `url(${selected.src})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      });
      setOverlayStyle({
        background: selected.overlay ?? "rgba(0,0,0,0.45)",
      });
    }
  }, [selected]);

  // set html/body classes for dark mode (optional)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (themeState?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeState?.darkMode]);

  // Only render background after hydration to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="relative min-h-screen">
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background image layer */}
      {selected && (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-center bg-no-repeat bg-cover"
          style={backgroundStyle}
        />
      )}

      {/* overlay for contrast & optional blur */}
      {selected && (
        <div aria-hidden="true" className="fixed -z-5" style={overlayStyle} />
      )}

      {/* Actual content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
