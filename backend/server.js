require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/AuthRoute");
const profileRoutes = require("./routes/profile");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

connectDB();

app.get("/", (req, res) => {
  res.send("ATS Backend Running");
});

app.use("/", authRoutes);
app.use("/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
