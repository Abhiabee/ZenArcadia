"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TaskList from "./TaskList";

export default function TaskListModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl ">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10 bg-black/20 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <X size={24} className="text-white" />
              </button>
              <div className="p-6">
                <TaskList />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
