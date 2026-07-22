import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";

describe("Task API", () => {
  let taskId: string;

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Test task", assignee: "Alice" });
    taskId = res.body.id;
  });

  describe("POST /api/tasks", () => {
    it("creates a task with required fields", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "New task", description: "Details", assignee: "Bob" });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: "New task",
        description: "Details",
        assignee: "Bob",
        status: "todo",
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
    });

    it("rejects a task with no title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ description: "No title" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Title is required");
    });

    it("rejects a task with empty title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "   " });

      expect(res.status).toBe(400);
    });

    it("rejects invalid status", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "X", status: "invalid" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid status");
    });

    it("simulates failure with ?fail=true", async () => {
      const res = await request(app)
        .post("/api/tasks?fail=true")
        .send({ title: "Will fail" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Simulated server failure");
    });
  });

  describe("GET /api/tasks", () => {
    it("returns all tasks", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("filters by status", async () => {
      await request(app)
        .post("/api/tasks")
        .send({ title: "Done task", status: "done" });

      const res = await request(app).get("/api/tasks?status=done");

      expect(res.status).toBe(200);
      expect(res.body.every((t: { status: string }) => t.status === "done")).toBe(true);
    });

    it("filters by assignee (case-insensitive)", async () => {
      const res = await request(app).get("/api/tasks?assignee=alice");

      expect(res.status).toBe(200);
      expect(res.body.every((t: { assignee: string }) => t.assignee.toLowerCase() === "alice")).toBe(true);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("returns a task by id", async () => {
      const res = await request(app).get(`/api/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(taskId);
    });

    it("returns 404 for nonexistent task", async () => {
      const res = await request(app).get("/api/tasks/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("updates task fields", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: "done", title: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("done");
      expect(res.body.title).toBe("Updated");
    });

    it("returns 404 for nonexistent task", async () => {
      const res = await request(app)
        .patch("/api/tasks/nonexistent")
        .send({ status: "done" });

      expect(res.status).toBe(404);
    });

    it("simulates failure with ?fail=true", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}?fail=true`)
        .send({ status: "done" });

      expect(res.status).toBe(500);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("deletes a task", async () => {
      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(204);

      const check = await request(app).get(`/api/tasks/${taskId}`);
      expect(check.status).toBe(404);
    });

    it("returns 404 for nonexistent task", async () => {
      const res = await request(app).delete("/api/tasks/nonexistent");

      expect(res.status).toBe(404);
    });
  });
});
