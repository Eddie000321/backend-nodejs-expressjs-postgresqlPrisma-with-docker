//const express = reqire("express");
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const app = express();
const PORT = process.env.PORT || 5001;

/// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
/// Get the directory name from the file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
// Serves the HTML file form the /public directory
// Tells express to serve all files from the public folder as tatic assets /file.
// Any requests for the css files will be resolved to the public directory.

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

// servin up the HTML file from the /public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
// simple guard using session
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }
  return res.status(401).json({ message: "unauthorized" });
}
app.use("/todos", requireAuth, todoRoutes);

// Start the server

import prisma from './prismaClient.js';

const connectWithRetry = async () => {
  for (let i = 0; i < 5; i++) {
    try {
      await prisma.$connect();
      console.log('Database connected successfully!');
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1}: Could not connect to database. Retrying in 5 seconds...`, error.message);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error('Failed to connect to database after multiple retries. Exiting.');
  process.exit(1);
};

connectWithRetry().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
