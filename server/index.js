require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/timers", require("./routes/timers"));

/* ✅ ADD THIS (keep-alive health check) */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(5000, () => console.log("Server running on 5000"));
