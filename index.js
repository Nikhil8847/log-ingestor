require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
// Routers
const logRouter = require("./routes/logRouter");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", logRouter);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server running on PORT ${port}...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
