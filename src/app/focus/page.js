"use client";
import React, { useEffect, useState } from "react";
import Timer from "../components/Timer/index";
import TimerModal from "../components/Timer/TimerModal";
import SoundMixer from "../components/SoundMixer/index";
import SoundMixerModal from "../components/SoundMixer/SoundMixerModal";
import { useDispatch } from "react-redux";
import { loadSessions } from "../store/sessionsSlice";
import Image from "next/image";
import ZenLogo from "../../../public/ZenLogo.png";
import ThemeSelector from "../components/Theme/ThemeSelector";
import ThemeSelectorModal from "../components/Theme/ThemeSelectorModal";
import TaskListModal from "../components/Tasks/TaskListModal";
import Dock from "../components/Dock/index";
import NotificationsToggle from "../components/Notification/NotificationsToggle";
import { RxLapTimer } from "react-icons/rx";
import { PiMusicNotesFill } from "react-icons/pi";
import { LuWallpaper } from "react-icons/lu";
import { LuListTodo } from "react-icons/lu";

export default function FocusPage() {
  const dispatch = useDispatch();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isThemesModalOpen, setIsThemesModalOpen] = useState(false);
  const [isAmbienceModalOpen, setIsAmbienceModalOpen] = useState(false);

  useEffect(() => {
    dispatch(loadSessions());
  }, [dispatch]);

  // Define dock items
  const dockItems = [
    {
      icon: <RxLapTimer size={24} />,
      label: "Timer",
      onClick: () => setIsTimerModalOpen(true),
      badgeCount: 0,
    },
    {
      icon: <PiMusicNotesFill size={24} />,
      label: "Ambience",
      onClick: () => setIsAmbienceModalOpen(true),
      badgeCount: 0,
    },
    {
      icon: <LuWallpaper size={24} />,
      label: "Themes",
      onClick: () => setIsThemesModalOpen(true),
    },
    {
      icon: <LuListTodo size={24} />,
      label: "Tasks",
      onClick: () => setIsTasksModalOpen(true),
    },
  ];

  return (
    <main className="relative min-h-screen text-white flex items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center gap-6">
          {/* Notifications Toggle */}
          <div className="absolute top-6 right-6 rounded-lg p-4">
            <NotificationsToggle />
          </div>

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

          {/* Timer Component */}
          <div className="w-full">
            <Timer />
          </div>

          {/* Dock Component */}
          <div className="mt-12 w-full flex justify-center">
            <Dock
              items={dockItems}
              magnification={50}
              distance={200}
              baseItemSize={50}
              panelHeight={64}
            />
          </div>

          {/* Theme Selector Modal */}
          <ThemeSelectorModal
            isOpen={isThemesModalOpen}
            onClose={() => setIsThemesModalOpen(false)}
          />

          {/* Timer Modal */}
          <TimerModal
            isOpen={isTimerModalOpen}
            onClose={() => setIsTimerModalOpen(false)}
          />

          {/* Ambience Modal */}
          <SoundMixerModal
            isOpen={isAmbienceModalOpen}
            onClose={() => setIsAmbienceModalOpen(false)}
          />

          {/* Tasks Modal */}
          <TaskListModal
            isOpen={isTasksModalOpen}
            onClose={() => setIsTasksModalOpen(false)}
          />
        </div>
      </div>
    </main>
  );
}
