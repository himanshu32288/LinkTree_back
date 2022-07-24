const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const LinkRoutes = require("./routes/linkRoutes");
const UsersRoutes = require("./routes/usersRoutes");
const groupRoutes = require("./routes/groupRoutes");
require("dotenv").config();

app.use(bodyParser.json({ limit: "16mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT"
  );
  next();
});
app.use("/links", LinkRoutes);
app.use("/group", groupRoutes);
app.use("/user/", UsersRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
