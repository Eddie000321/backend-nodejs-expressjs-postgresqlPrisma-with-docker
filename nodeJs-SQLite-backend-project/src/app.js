import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import session from "express-session";

const app = express();

/// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
/// Get the directory name from the file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());

// Static assets
app.use(express.static(path.join(__dirname, "../public")));

// Sessions (in-memory for demo)
const isProd = process.env.NODE_ENV === "production";
const oneDayMs = 24 * 60 * 60 * 1000;
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_me_session_secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: oneDayMs,
    },
  })
);

// HTML entry
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }
  return res.status(401).json({ message: "unauthorized" });
}
app.use("/todos", requireAuth, todoRoutes);

export default app;

