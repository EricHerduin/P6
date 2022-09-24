require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/users");
const path = require("path");

// Connection Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.mongoLogin}:${process.env.mongoPassWord}@cluster0.zdgr5vh.mongodb.net/projet6Data?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//CORS
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

// lancement d'express
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(__dirname + "/images"));

//logique de routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
