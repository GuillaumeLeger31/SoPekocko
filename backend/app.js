const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();
mongoose
  .connect(process.env.DB_URI,
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(helmet());
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4200');
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
