import { v4 as uuidv4 } from "uuid";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  assignee?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee?: string;
}

const tasks: Map<string, Task> = new Map();

export function getAllTasks(): Task[] {
  return Array.from(tasks.values());
}

export function getTaskById(id: string): Task | undefined {
  return tasks.get(id);
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title: input.title,
    description: input.description ?? "",
    status: input.status ?? "todo",
    assignee: input.assignee ?? "",
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function updateTask(
  id: string,
  input: UpdateTaskInput
): Task | undefined {
  const task = tasks.get(id);
  if (!task) return undefined;

  const updated: Task = {
    ...task,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  tasks.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}

export function filterTasks(status?: string, assignee?: string): Task[] {
  let result = getAllTasks();

  if (status) {
    result = result.filter((t) => t.status === status);
  }
  if (assignee) {
    result = result.filter(
      (t) => t.assignee.toLowerCase() === assignee.toLowerCase()
    );
  }

  return result;
}
