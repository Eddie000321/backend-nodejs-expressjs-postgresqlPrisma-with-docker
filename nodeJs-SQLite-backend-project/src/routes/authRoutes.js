import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

// Register a new user endpoint /auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  // save the username and an irreversibly encrypted password
  // save gilgamesh@gmail.com -> ex) eir92q8q0y8afhabfq3

  // encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);
  // save the new user and hshed password to the db
  try {
    const insertUser = db.prepare(
      "INSERT INTO users (username, password) VALUES(?, ?)"
    );
    const result = insertUser.run(username, hashedPassword);

    // now that we have a user, I want to add their first todo for them
    const deafultTodo = `Hello :) Add your first todo!`;
    const insertTodo = db.prepare(
      "INSERT INTO todos (user_id, task) VALUES(?, ?)"
    );
    insertTodo.run(result.lastInsertRowid, deafultTodo);

    // establish a session
    req.session.regenerate((err) => {
      if (err) return res.sendStatus(503);
      req.session.userId = result.lastInsertRowid;
      res.json({ ok: true });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(503);
  }
});
// lgoin route endpoint
router.post("/login", (req, res) => {
  // get email and look up the password associated with that email in the database
  // get it back and see it's encrypted, which means that cannot compoare it to the one the user just used trying to login
  // so what can to do?, is again, one way encrypt the password the user just entered

  const { username, password } = req.body;

  try {
    const getUser = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = getUser.get(username);

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
    req.session.regenerate((err) => {
      if (err) return res.sendStatus(503);
      req.session.userId = user.id;
      res.json({ ok: true });
    });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

// current session user
router.get("/me", (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const getUser = db.prepare("SELECT id, username FROM users WHERE id = ?");
  const user = getUser.get(req.session.userId);
  return res.json({ user });
});

// logout and clear session
router.post("/logout", (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => res.json({ ok: true }));
});

export default router;
