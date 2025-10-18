// File: Backend/tests/admincontroller.test.cjs
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app.cjs");

// Import test-friendly CommonJS models
const Doctor = require("../models/doctormodel.cjs");
const User = require("../models/usermodel.cjs");

let mongoServer;

// ✅ Setup in-memory MongoDB before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// ✅ Clean up after all tests finish
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Admin Controller API Tests", () => {
  // ✅ Test 1 — Get all users
  test("GET /api/v1/admin/getAllUsers should return user list", async () => {
    // Create dummy user in DB
    await User.create({
      name: "Tarun",
      email: "tarun@test.com",
      password: "12345",
    });

    // Send request
    const res = await request(app)
      .get("/api/v1/admin/getAllUsers")
      .set("Authorization", "Bearer dummyToken");

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ✅ Test 2 — Get all doctors
  test("GET /api/v1/admin/getAllDoctors should return doctor list", async () => {
    await Doctor.create({
      userId: "123",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "9876543210",
      email: "john@example.com",
      website: "www.johndoeclinic.com",
      address: "Main Street 12",
      specialization: "Dentist",
      experience: "5 years",
      feesPerConsultation: 200,
      timings: { start: "9:00 AM", end: "5:00 PM" },
      status: "approved",
    });

    const res = await request(app)
      .get("/api/v1/admin/getAllDoctors")
      .set("Authorization", "Bearer dummyToken");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ✅ Test 3 — Change doctor account status
  test("POST /api/v1/admin/changeAccountStatus should update doctor status", async () => {
    const user = await User.create({
      name: "TestUser",
      email: "user@test.com",
      password: "abc123",
    });

    const doctor = await Doctor.create({
      userId: user._id.toString(),
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "9998887777",
      email: "jane@example.com",
      website: "www.janeclinic.com",
      address: "Park Avenue 9",
      specialization: "Cardiologist",
      experience: "10 years",
      feesPerConsultation: 300,
      timings: { start: "10:00 AM", end: "6:00 PM" },
      status: "pending",
    });

    const res = await request(app)
      .post("/api/v1/admin/changeAccountStatus")
      .set("Authorization", "Bearer dummyToken")
      .send({ doctorId: doctor._id, status: "approved" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("approved");
  });
});
