const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/router");
const navigationRoutes = require("./routes/userRoutes");
require("dotenv").config();

const accLogFiles = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accLogFiles }));

const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors(/*{
    origin:'http://127.0.0.1:5501',
    methods:['GET', 'PUT', 'DELETE','POST']
}*/)
);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://cdnjs.cloudflare.com https://api.razorpay.com https://cdn.jsdelivr.net https://checkout.razorpay.com https://img.freepik.com 'unsafe-inline'; connect-src 'self' https://lumberjack-cx.razorpay.com"
  );
  next();
});

app.use(router);
app.use(navigationRoutes);

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then((result) => {
    console.log("yha se suru hai");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
