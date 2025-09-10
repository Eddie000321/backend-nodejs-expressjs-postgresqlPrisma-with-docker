import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const app = express();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Core middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Sessions (Postgres store)
const PgSession = connectPgSimple(session);
const isProd = process.env.NODE_ENV === "production";
const oneDayMs = 24 * 60 * 60 * 1000;

app.set("trust proxy", 1);
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session",
      createTableIfMissing: true,
    }),
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

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

