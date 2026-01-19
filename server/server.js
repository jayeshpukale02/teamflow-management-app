import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workspaceRouter from "./routes/workspaceRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";

const app = express();

/* ---------------- CORS (MUST BE FIRST) ---------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5174", // local frontend
      "https://teamflow-management.vercel.app", // deployed frontend (if any)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicit preflight handling
app.options("*", cors());

/* ---------------- MIDDLEWARES ---------------- */
app.use(express.json());
app.use(clerkMiddleware());

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("server is live!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/workspaces", protect, workspaceRouter);

/* ---------------- EXPORT (NO listen) ---------------- */
export default app;
