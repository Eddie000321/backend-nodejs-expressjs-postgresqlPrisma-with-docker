//const express = reqire("express");
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

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
app.use("/todos", authMiddleware, todoRoutes); // todoRoutes are protected by authMiddleware

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
