"use client";

import { Task } from "@/types/task";

interface FilterBarProps {
  tasks: Task[];
  selectedAssignee: string;
  onAssigneeChange: (assignee: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  simulateFailure: boolean;
  onSimulateFailureChange: (value: boolean) => void;
}

export default function FilterBar({
  tasks,
  selectedAssignee,
  onAssigneeChange,
  searchQuery,
  onSearchChange,
  simulateFailure,
  onSimulateFailureChange,
}: FilterBarProps) {
  const assignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter(Boolean))
  ).sort();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          Search:
        </label>
        <input
          id="search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by title..."
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="assignee-filter" className="text-sm font-medium text-gray-700">
          Assignee:
        </label>
        <select
          id="assignee-filter"
          value={selectedAssignee}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All</option>
          {assignees.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={simulateFailure}
          onChange={(e) => onSimulateFailureChange(e.target.checked)}
          className="rounded border-gray-300"
        />
        Simulate API failure
      </label>
    </div>
  );
}
