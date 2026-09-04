const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();

const authRoute = require("./routes/AuthRoute");
const uploadRoute = require("./routes/uploadRoute");
const resumeHistoryRoute = require("./routes/resumeHistoryRoute");

const { PORT } = process.env;

// MongoDB

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());

// Routes

app.use("/", authRoute);

app.use("/api/upload", uploadRoute);

app.use("/api/resumes/history", resumeHistoryRoute);

// Test

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Server

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
