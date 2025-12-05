"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../../store/tasksSlice";
import { MdAddCircle } from "react-icons/md";

export default function NewTaskForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await dispatch(addTask({ title, notes }));
    setTitle("");
    setNotes("");
  }

  return (
    <form onSubmit={handleAdd} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-800/60 text-white placeholder-gray-400 outline-none border-2"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="px-3 py-2 bg-indigo-600 rounded-full text-white"
          type="submit"
        >
          <MdAddCircle size={24} />
        </button>
      </div>
      <textarea
        className="w-full px-3 py-2 rounded bg-gray-800/60 text-white placeholder-gray-400 outline-none text-sm border-2"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />
    </form>
  );
}
