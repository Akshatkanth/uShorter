const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
require("dotenv").config();
const cors = require("cors");



const app = express();
app.use(cors());
//middleware
app.use(express.json());

//Routes
app.use("/", urlRoutes);

//db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("mongodb connection error",err));


  // Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});