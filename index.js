const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const user = require("./routes/user");
const login = require("./routes/login");
const survey = require("./routes/survey");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", user);
app.use("/api/survey", survey);
app.use("/api/login", login);
app.use("/api/tokenIsValid", auth, (req, res) => {
  res.send({ value: true, message: "success" });
});

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("Connected to the database!");
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
