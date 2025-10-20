// File: Backend/tests/usercontroller.test.cjs
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app.cjs");
const User = require("../models/usermodel.cjs");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Controller API Tests", () => {
  test("POST /api/v1/user/register should create a new user", async () => {
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({
        name: "Tarun Register",
        email: "tarun_register@test.com", // ✅ unique
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("POST /api/v1/user/login should log in a user", async () => {
    await User.create({ name: "Tarun Login", email: "tarun_login@test.com", password: "123456" }); // ✅ unique

    const res = await request(app)
      .post("/api/v1/user/login")
      .send({
        email: "tarun_login@test.com", // ✅ match created one
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test("POST /api/v1/user/getUserData should return user details", async () => {
    const user = await User.create({
      name: "sunny",
      email: "sun_getdata@test.com", // ✅ unique
      password: "abc123",
    });

    const res = await request(app)
      .post("/api/v1/user/getUserData")
      .set("Authorization", "Bearer fakeToken")
      .send({ userId: user._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("sun_getdata@test.com");
  });
});
