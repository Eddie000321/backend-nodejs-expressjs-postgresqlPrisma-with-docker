import request from "supertest";
import app from "../src/app.js";
import test from "node:test";
import assert from "node:assert/strict";

// Note: These tests require a reachable Postgres via DATABASE_URL
// and Prisma schema migrated. Recommended to run inside Docker:
// docker compose run --rm app sh -c "npx prisma migrate deploy && node --test"

test("registers a new user and sets session", async () => {
  const email = `user_${Date.now()}@example.com`;
  const res = await request(app)
    .post("/auth/register")
    .send({ username: email, password: "123123" })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.ok(res.headers["set-cookie"]);
});

test("denies unauthenticated access to /todos", async () => {
  const res = await request(app).get("/todos");
  assert.equal(res.status, 401);
});

test("logs in and performs todos CRUD with cookie session", async () => {
  const email = `agent_${Date.now()}@example.com`;
  await request(app)
    .post("/auth/register")
    .send({ username: email, password: "123123" })
    .set("Content-Type", "application/json");

  const agent = request.agent(app);
  const login = await agent
    .post("/auth/login")
    .send({ username: email, password: "123123" })
    .set("Content-Type", "application/json");
  assert.equal(login.status, 200);
  assert.equal(login.body.ok, true);

  const created = await agent
    .post("/todos")
    .send({ task: "Write tests" })
    .set("Content-Type", "application/json");
  assert.equal(created.status, 200);
  assert.ok("id" in created.body);
  const id = created.body.id;

  const list1 = await agent.get("/todos");
  assert.equal(list1.status, 200);
  assert.ok(Array.isArray(list1.body));
  assert.ok(list1.body.length >= 1);

  const updated = await agent
    .put(`/todos/${id}`)
    .send({ completed: 1 })
    .set("Content-Type", "application/json");
  assert.equal(updated.status, 200);

  const removed = await agent.delete(`/todos/${id}`);
  assert.equal(removed.status, 200);
});

