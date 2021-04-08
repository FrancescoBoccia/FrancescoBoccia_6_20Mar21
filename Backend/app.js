// PASSWORD  = OxI8xDdYbfPWGH7C
// USERNAME  = Francesco

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const path = require("path");

const app = express();

const Sauce = require("./models/Sauce");

//Connecting to Mongoose
mongoose
  .connect(
    "mongodb+srv://Francesco:OxI8xDdYbfPWGH7C@cluster0.mub3m.mongodb.net/<dbname>?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Succesfully connected to mongoose");
  })
  .catch((error) => {
    console.log("Unable to log mongoose");
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// This tells Express to serve up the static resource  images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
