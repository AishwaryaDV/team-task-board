import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);

export default app;
