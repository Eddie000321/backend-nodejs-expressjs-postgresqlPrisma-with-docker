//const express = reqire("express");
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5001;

/// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);

/// Get the directory name from the file path
const __dirname = dirname(__filename);

// Serves the HTML file form the /public directory
// Tells express to serve all files from the public folder as tatic assets /file

// servin up the HTML file from the /public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
