//const express = reqire("express");
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

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

// servin up the HTML file from the /public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
