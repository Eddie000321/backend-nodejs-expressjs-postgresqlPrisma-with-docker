import express from "express";
import db from "../db.js";

const router = express.Router();

// get all todos for logged-in user
router.get("/", (req, res) => {});

// create an new todo
router.post("/", (req, res) => {});

// update a todo
router.put("/:id", (req, res) => {});

// delete a todo
router.delete("/:id", (req, res) => {});

export default router;
