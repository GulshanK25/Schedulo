import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.config.js";

// Import routes
import doctorRoutes from "./routes/doctorroutes.js";
import adminRoutes from "./routes/adminroutes.js";
import userRoutes from "./routes/userroutes.js"; 


dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);


app.get("/", (req, res) => {
  res.send("✅ Schedulo Backend is running successfully!");
});


const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
