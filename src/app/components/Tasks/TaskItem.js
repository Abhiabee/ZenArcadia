"use client";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { useDispatch } from "react-redux";
import {
  updateTask,
  deleteTask,
  toggleComplete,
  setPriority,
} from "../../store/tasksSlice";
import { RiPushpin2Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { ImCheckboxUnchecked } from "react-icons/im";
import { FaCheck } from "react-icons/fa6";

export default function TaskItem({ task }) {
  const dispatch = useDispatch();
  const [, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const titleRef = useRef(null);

  const save = useCallback(async () => {
    if (!title.trim()) return;
    startTransition(() => {
      dispatch(updateTask({ ...task, title: title.trim(), notes }));
    });
    setEditing(false);
  }, [title, notes, task, dispatch, startTransition]);

  const formattedDate = useMemo(
    () => new Date(task.createdAt).toLocaleString(),
    [task.createdAt]
  );

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;
    if (!confirm("Delete this task?")) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteTask(task.id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  }, [dispatch, task.id, isDeleting]);

  const handleToggleComplete = useCallback(() => {
    dispatch(toggleComplete(task.id));
  }, [dispatch, task.id]);

  const handlePriority = useCallback(() => {
    dispatch(setPriority(task.id));
  }, [dispatch, task.id]);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded border ${
        task.priority
          ? "border-indigo-500 bg-gray-800/60"
          : "border-transparent bg-gray-800/60"
      }`}
    >
      <div className="flex-shrink-0">
        <button
          onClick={handleToggleComplete}
          aria-label="Toggle complete"
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            task.completed
              ? "bg-emerald-500 text-white"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          {task.completed ? <FaCheck /> : <ImCheckboxUnchecked />}
        </button>
      </div>

      <div className="flex-1">
        {!editing ? (
          <>
            <div className="flex items-center justify-between">
              <div
                className={`text-sm font-medium ${
                  task.completed ? "line-through text-gray-400" : "text-white"
                }`}
              >
                {task.title}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePriority}
                  title="Pin as priority"
                  className={`px-2 py-1 rounded ${
                    task.priority
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  <RiPushpin2Line />
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="px-2 py-1 rounded bg-gray-700 text-gray-200"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-2 py-1 rounded ${
                    isDeleting
                      ? "bg-red-800 text-gray-400 opacity-50 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  } transition-colors`}
                >
                  {isDeleting ? "..." : <AiOutlineDelete />}
                </button>
              </div>
            </div>
            {task.notes ? (
              <div className="mt-1 text-xs text-white/70">{task.notes}</div>
            ) : null}
            <div className="mt-1 text-xs text-gray-400">
              Created: {formattedDate}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 text-white outline-none"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="px-3 py-2 rounded bg-gray-800 text-white outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={save}
                className="px-3 py-1 bg-emerald-500 rounded text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setTitle(task.title);
                  setNotes(task.notes || "");
                }}
                className="px-3 py-1 rounded border border-gray-700 text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
