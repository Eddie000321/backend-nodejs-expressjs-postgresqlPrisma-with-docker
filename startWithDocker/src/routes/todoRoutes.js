import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// get all todos for logged-in user
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.json(todos);
});

// create an new todo
router.post("/", async (req, res) => {
  const { task } = req.body;
  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId,
    },
  });

  res.json(todo);
});

// update a todo (scoped to current user)
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const result = await prisma.todo.updateMany({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
    data: {
      completed: !!completed,
    },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "todo not found" });
  }

  res.json({ ok: true });
});

// delete a todo (scoped to current user)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const result = await prisma.todo.deleteMany({
    where: {
      id: parseInt(id),
      userId,
    },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "todo not found" });
  }

  res.json({ ok: true });
});

export default router;
