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

  console.log(hashedPassword);
  console.log(username, password);
  res.sendStatus(201);
});
// lgoin route endpoint
router.post("/login", (req, res) => {
  // get email and look up the password associated with that email in the database
  // get it back and see it's encrypted, which means that cannot compoare it to the one the user just used trying to login
  // so what can to do?, is again, one way encrypt the password the user just entered
});

export default router;
