
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app.cjs");
const Doctor = require("../models/doctormodel.cjs");
const Appointment = require("../models/appointmentmodel.cjs");

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

describe("Doctor Controller API Tests", () => {
  test("POST /api/v1/doctor/add should add a doctor", async () => {
    const res = await request(app)
      .post("/api/v1/doctor/add")
      .send({
        userId: "u001",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "9998887777",
        email: "john@doe.com",
        website: "www.johndoe.com",
        address: "Sweden Street 45",
        specialization: "Dentist",
        experience: "7 years",
        feesPerConsultation: 200,
        timings: { start: "9 AM", end: "5 PM" },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("john@doe.com");
  });

  test("POST /api/v1/doctor/getDoctorInfo should return doctor info", async () => {
    const doctor = await Doctor.create({
      userId: "u001",
      firstName: "Dr",
      lastName: "Jane",
      phoneNumber: "8887776666",
      email: "jane@clinic.com",
      website: "www.janeclinic.com",
      address: "Karlskrona 12",
      specialization: "Cardiology",
      experience: "10 years",
      feesPerConsultation: 300,
      timings: { start: "10 AM", end: "6 PM" },
      status: "approved",
    });

    const res = await request(app)
      .post("/api/v1/doctor/getDoctorInfo")
      .send({ userId: doctor.userId });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("john@doe.com");
  });

  test("POST /api/v1/doctor/update-status should update appointment status", async () => {
    const appointment = await Appointment.create({
      userId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      doctorInfo: "Dr. Smith",
      userInfo: "Patient One",
      date: "2025-10-18",
      time: "11:00 AM",
      status: "pending",
    });

    const res = await request(app)
      .post("/api/v1/doctor/update-status")
      .send({ appointmentId: appointment._id, status: "approved" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("approved");
  });
});
