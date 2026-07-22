import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  filterTasks,
} from "../models/task";
import { validateCreateTask, validateUpdateTask } from "../middleware/validate";

const router = Router();

router.get("/", (req, res) => {
  const { status, assignee } = req.query;

  const tasks =
    status || assignee
      ? filterTasks(status as string | undefined, assignee as string | undefined)
      : getAllTasks();

  res.json(tasks);
});

router.get("/:id", (req, res) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

router.post("/", validateCreateTask, (req, res) => {
  if (req.query.fail === "true") {
    res.status(500).json({ error: "Simulated server failure" });
    return;
  }

  const task = createTask(req.body);
  res.status(201).json(task);
});

router.patch("/:id", validateUpdateTask, (req, res) => {
  if (req.query.fail === "true") {
    res.status(500).json({ error: "Simulated server failure" });
    return;
  }

  const task = updateTask(req.params.id, req.body);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

router.delete("/:id", (req, res) => {
  if (req.query.fail === "true") {
    res.status(500).json({ error: "Simulated server failure" });
    return;
  }

  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(204).send();
});

export default router;
