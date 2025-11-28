// src/app/focus/page.js
"use client";

import React, { useEffect } from "react";
import Timer from "../components/Timer/index";
import { useDispatch } from "react-redux";
import { loadSessions } from "../store/sessionsSlice";
import Image from "next/image";
import ZenLogo from "../../../public/ZenLogo.png";
import backgroundImage from "../../../public/Back2.jpg";

export default function FocusPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSessions());
  }, [dispatch]);

  return (
    <main className="relative min-h-screen text-white flex items-center justify-center p-6 overflow-hidden">
      <Image
        src={backgroundImage}
        alt="Focus background"
        fill
        className="absolute inset-0 object-cover -z-10"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-black/30 -z-10" />

      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">ZenArcadia</h1>
            <Image
              src={ZenLogo}
              alt="ZenArcadia Logo"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>

          <div>
            <Timer />
          </div>
        </div>
      </div>
    </main>
  );
}
