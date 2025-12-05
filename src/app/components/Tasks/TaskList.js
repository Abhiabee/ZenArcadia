"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadTasks } from "../../store/tasksSlice";
import NewTaskForm from "./NewTaskForm";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.tasks.items || []);
  const status = useSelector((s) => s.tasks.status);

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  // sort: priority first, then incomplete, then recent
  const sorted = [...tasks].sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 bg-white/10 backdrop-blur-lg rounded-lg border-2 border-white/20">
      <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
      <NewTaskForm />
      <div className="space-y-2 mt-2">
        {status === "loading" && (
          <div className="text-sm text-gray-400">Loading...</div>
        )}
        {sorted.length === 0 && status !== "loading" && (
          <div className="text-sm text-gray-800">
            No tasks yet. Add one above.
          </div>
        )}
        {sorted.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
