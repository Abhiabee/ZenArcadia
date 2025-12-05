"use client";

import React, { useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import DockItem from "./DockItem";

export default function Dock({
  items = [],
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(panelHeight, magnification + 20),
    [magnification, panelHeight]
  );

  const animatedHeight = useSpring(
    useTransform(isHovered, [0, 1], [panelHeight, maxHeight]),
    spring
  );

  return (
    <motion.div
      className="mx-2 flex max-w-full items-center justify-center "
      style={{ minHeight: maxHeight }}
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`flex items-end gap-6 w-fit rounded-2xl border-2 px-4 pb-2 bg-white/10 backdrop-blur-lg ${className}`}
        style={{ height: animatedHeight ? 70 : animatedHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distance={distance}
            spring={spring}
            badgeCount={item.badgeCount}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
