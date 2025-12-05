"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { useDockItemSize } from "./useDockItemSize";

export default function DockItem({
  icon,
  label,
  onClick,
  mouseX,
  baseItemSize,
  magnification,
  distance,
  spring,
  badgeCount,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);
  const size = useDockItemSize(
    mouseX,
    baseItemSize,
    magnification,
    distance,
    ref,
    spring
  );
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (value) =>
      setShowLabel(value === 1)
    );
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-full bg-background shadow-xl cursor-pointer border-2 border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      <div className="flex items-center justify-center">{icon}</div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -15 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border bg-white/10 backdrop-blur-lg px-2 py-0.5 text-xs text-white"
            style={{ x: "-50%" }}
            role="tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
