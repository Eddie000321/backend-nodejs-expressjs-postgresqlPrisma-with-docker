import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";

const router = express.Router();

// Register a new user endpoint /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // save the username and an irreversibly encrypted password
  // save gilgamesh@gmail.com -> ex) eir92q8q0y8afhabfq3

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);
  // save the new user and hshed password to the db
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // now that we have a user, I want to add their first todo for them
    const deafultTodo = `Hello :) Add your first todo!`;
    await prisma.todo.create({
      data: {
        task: deafultTodo,
        userId: user.id,
      },
    });

    // establish a session (regenerate to prevent fixation)
    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => (err ? reject(err) : resolve()));
    });
    req.session.userId = user.id;
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.sendStatus(503);
  }
});
// lgoin route endpoint
router.post("/login", async (req, res) => {
  // get email and look up the password associated with that email in the database
  // get it back and see it's encrypted, which means that cannot compoare it to the one the user just used trying to login
  // so what can to do?, is again, one way encrypt the password the user just entered

  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // if we cannot find a user associated with that username, return out from the function
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    // if the password does not match, return out of the function
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }
    // then we have a successful authentication -> establish session
    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => (err ? reject(err) : resolve()));
    });
    req.session.userId = user.id;
    res.json({ ok: true });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

// current session user
router.get("/me", async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const user = await prisma.user.findUnique({ where: { id: req.session.userId }, select: { id: true, username: true } });
    return res.json({ user });
  } catch (e) {
    return res.sendStatus(503);
  }
});

// logout and clear session
router.post("/logout", async (req, res) => {
  try {
    if (!req.session) return res.json({ ok: true });
    await new Promise((resolve, _reject) => req.session.destroy(() => resolve()));
    res.json({ ok: true });
  } catch (e) {
    res.sendStatus(503);
  }
});

export default router;
