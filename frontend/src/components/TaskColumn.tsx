import { Task, TaskStatus } from "@/types/task";
import TaskCard from "./TaskCard";

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-gray-100 text-gray-700" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  done: { label: "Done", color: "bg-green-100 text-green-700" },
};

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskColumn({
  status,
  tasks,
  onStatusChange,
  onDelete,
}: TaskColumnProps) {
  const config = STATUS_CONFIG[status];

  return (
    <section
      className="flex min-h-[200px] flex-1 flex-col rounded-xl bg-gray-50 p-4"
      aria-label={`${config.label} column, ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
    >
      <header className="mb-4 flex items-center gap-2">
        <h2 className={`rounded-full px-3 py-1 text-sm font-semibold ${config.color}`}>
          {config.label}
        </h2>
        <span className="text-sm text-gray-400" aria-hidden="true">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-col gap-3" role="list" aria-label={`${config.label} tasks`}>
        {tasks.map((task) => (
          <div role="listitem" key={task.id}>
            <TaskCard
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No tasks</p>
        )}
      </div>
    </section>
  );
}
