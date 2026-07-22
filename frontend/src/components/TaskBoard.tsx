"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Task, TaskStatus, CreateTaskInput } from "@/types/task";
import * as api from "@/lib/api";
import TaskColumn from "./TaskColumn";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = useCallback(async (input: CreateTaskInput) => {
    const task = await api.createTask(input);
    setTasks((prev) => [...prev, task]);
    announce(`Task "${task.title}" created`);
  }, []);

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const previous = tasks;
      const task = tasks.find((t) => t.id === taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      announce(`Task "${task?.title}" moved to ${newStatus.replace("_", " ")}`);

      try {
        await api.updateTask(taskId, { status: newStatus }, simulateFailure);
      } catch {
        setTasks(previous);
        const msg = "Failed to update task status. Change has been reverted.";
        setError(msg);
        announce(msg);
      }
    },
    [tasks, simulateFailure]
  );

  const handleDelete = useCallback(
    async (taskId: string) => {
      const previous = tasks;
      const task = tasks.find((t) => t.id === taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      announce(`Task "${task?.title}" deleted`);

      try {
        await api.deleteTask(taskId, simulateFailure);
      } catch {
        setTasks(previous);
        const msg = "Failed to delete task. It has been restored.";
        setError(msg);
        announce(msg);
      }
    },
    [tasks, simulateFailure]
  );

  const filteredTasks = useMemo(() => {
    if (!assigneeFilter) return tasks;
    return tasks.filter(
      (t) => t.assignee.toLowerCase() === assigneeFilter.toLowerCase()
    );
  }, [tasks, assigneeFilter]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status" aria-label="Loading tasks">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <span className="sr-only">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div>
      <div
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <TaskForm onSubmit={handleCreate} />
        <FilterBar
          tasks={tasks}
          selectedAssignee={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          simulateFailure={simulateFailure}
          onSimulateFailureChange={setSimulateFailure}
        />
      </div>

      {error && (
        <div
          className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 font-medium hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-1"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter((t) => t.status === status)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
