"use client";

import { Task, TaskStatus } from "@/types/task";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete(task.id);
    }
  };

  return (
    <article
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-300"
      aria-label={`Task: ${task.title}`}
      onKeyDown={handleKeyDown}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
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
