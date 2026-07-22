"use client";

import { useState } from "react";
import { Task, TaskStatus, UpdateTaskInput } from "@/types/task";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (taskId: string, input: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assignee);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete(task.id);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setEditError("Title is required");
      return;
    }

    setSaving(true);
    setEditError(null);
    try {
      await onEdit(task.id, {
        title: title.trim(),
        description,
        assignee,
      });
      setEditing(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setAssignee(task.assignee);
    setEditError(null);
    setEditing(false);
  };

  if (editing) {
    return (
      <article
        className="rounded-lg border border-blue-300 bg-white p-4 shadow-sm"
        aria-label={`Editing task: ${task.title}`}
      >
        {editError && (
          <div className="mb-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700" role="alert">
            {editError}
          </div>
        )}

        <div className="mb-2">
          <label htmlFor={`edit-title-${task.id}`} className="mb-1 block text-xs font-medium text-gray-600">
            Title *
          </label>
          <input
            id={`edit-title-${task.id}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <div className="mb-2">
          <label htmlFor={`edit-desc-${task.id}`} className="mb-1 block text-xs font-medium text-gray-600">
            Description
          </label>
          <textarea
            id={`edit-desc-${task.id}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-3">
          <label htmlFor={`edit-assignee-${task.id}`} className="mb-1 block text-xs font-medium text-gray-600">
            Assignee
          </label>
          <input
            id={`edit-assignee-${task.id}`}
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Name"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-300"
      aria-label={`Task: ${task.title}`}
      onKeyDown={handleKeyDown}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => setEditing(true)}
            className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Edit task: ${task.title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={`Delete task: ${task.title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-500">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as TaskStatus)
          }
          className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={`Change status for: ${task.title}`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {task.assignee && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {task.assignee}
          </span>
        )}
      </div>
    </article>
  );
}
