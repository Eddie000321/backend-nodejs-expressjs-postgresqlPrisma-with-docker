import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Register route endpoint
router.post("/register", (req, res) => {});
// lgoin route endpoint
router.post("/login", (req, res) => {});

export default router;
