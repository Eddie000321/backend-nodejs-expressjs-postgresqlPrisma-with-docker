import request from "supertest";
import app from "../src/app.js";
import test from "node:test";
import assert from "node:assert/strict";

test("registers a new user and sets session", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "user1@example.com", password: "123123" })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.ok(res.headers["set-cookie"]);
});

test("rejects duplicate username", async () => {
  await request(app)
    .post("/auth/register")
    .send({ username: "dup@example.com", password: "123123" })
    .set("Content-Type", "application/json");
  const res = await request(app)
    .post("/auth/register")
    .send({ username: "dup@example.com", password: "123123" })
    .set("Content-Type", "application/json");
  assert.ok(res.status >= 400);
});

test("denies unauthenticated access to /todos", async () => {
  const res = await request(app).get("/todos");
  assert.equal(res.status, 401);
});

test("logs in and performs todos CRUD with cookie session", async () => {
  // first register
  await request(app)
    .post("/auth/register")
    .send({ username: "agent@example.com", password: "123123" })
    .set("Content-Type", "application/json");

  const agent = request.agent(app);
  const login = await agent
    .post("/auth/login")
    .send({ username: "agent@example.com", password: "123123" })
    .set("Content-Type", "application/json");
  assert.equal(login.status, 200);
  assert.equal(login.body.ok, true);

  // create todo
  const created = await agent
    .post("/todos")
    .send({ task: "Write tests" })
    .set("Content-Type", "application/json");
  assert.equal(created.status, 200);
  assert.ok("id" in created.body);
  const id = created.body.id;

  // list todos
  const list1 = await agent.get("/todos");
  assert.equal(list1.status, 200);
  assert.ok(Array.isArray(list1.body));
  assert.ok(list1.body.length >= 1);

  // update
  const updated = await agent
    .put(`/todos/${id}`)
    .send({ completed: 1 })
    .set("Content-Type", "application/json");
  assert.equal(updated.status, 200);

  // delete
  const removed = await agent.delete(`/todos/${id}`);
  assert.equal(removed.status, 200);
});
