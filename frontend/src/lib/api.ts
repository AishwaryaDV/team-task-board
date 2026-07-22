import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.error || `Request failed with status ${response.status}`,
      response.status
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function fetchTasks(
  status?: string,
  assignee?: string
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (assignee) params.set("assignee", assignee);

  const query = params.toString();
  const url = `${API_BASE}/api/tasks${query ? `?${query}` : ""}`;

  const response = await fetch(url);
  return handleResponse<Task[]>(response);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(response);
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  simulateFailure = false
): Promise<Task> {
  const url = `${API_BASE}/api/tasks/${id}${simulateFailure ? "?fail=true" : ""}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(response);
}

export async function deleteTask(
  id: string,
  simulateFailure = false
): Promise<void> {
  const url = `${API_BASE}/api/tasks/${id}${simulateFailure ? "?fail=true" : ""}`;
  const response = await fetch(url, { method: "DELETE" });
  return handleResponse<void>(response);
}
