import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";

dotenv.config();
connectDB();

const app = express();


app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.port;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
