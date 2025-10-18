// File: Backend/app.cjs
const express = require("express");
const adminRoutes = require("./routes/adminroutes.cjs");
const doctorRoutes = require("./routes/doctorroutes.cjs");
const userRoutes = require("./routes/userroutes.cjs"); // ✅ add this line
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/user", userRoutes); // ✅ add this line

module.exports = app;
