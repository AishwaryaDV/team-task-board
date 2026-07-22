import { Request, Response, NextFunction } from "express";
import { TaskStatus } from "../models/task";

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

export function validateCreateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { title, status } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "Title is required and must be a non-empty string" });
    return;
  }

  if (status && !VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  next();
}

export function validateUpdateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { title, status } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
    res.status(400).json({ error: "Title must be a non-empty string" });
    return;
  }

  if (status && !VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  next();
}
