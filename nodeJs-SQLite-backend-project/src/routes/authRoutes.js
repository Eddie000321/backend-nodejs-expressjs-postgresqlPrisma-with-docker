import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

    // create a token
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.sendStatus(503);
  }

  console.log(hashedPassword);
  console.log(username, password);
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
    // then we have a successful authentication
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;
