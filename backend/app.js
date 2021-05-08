const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://gui31:159357@cluster0.p2nfc.mongodb.net/cluster0?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

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

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", UserRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
