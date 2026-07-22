import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/types/task";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "A test description",
  status: "todo",
  assignee: "Alice",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("TaskCard", () => {
  it("renders task title and description", () => {
    render(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("renders assignee badge", () => {
    render(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("hides description when empty", () => {
    const taskNoDesc = { ...mockTask, description: "" };
    render(
      <TaskCard task={taskNoDesc} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.queryByText("A test description")).not.toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />
    );

    fireEvent.click(screen.getByLabelText("Delete task: Test Task"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("calls onStatusChange when status dropdown changes", () => {
    const onStatusChange = vi.fn();
    render(
      <TaskCard task={mockTask} onStatusChange={onStatusChange} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    fireEvent.change(screen.getByLabelText("Change status for: Test Task"), {
      target: { value: "done" },
    });
    expect(onStatusChange).toHaveBeenCalledWith("1", "done");
  });

  it("has correct aria-label on the card element", () => {
    render(
      <TaskCard task={mockTask} onStatusChange={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByLabelText("Task: Test Task")).toBeInTheDocument();
  });
});
