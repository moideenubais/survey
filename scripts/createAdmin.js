const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const mongoose = require("mongoose");

createAdmin = async () => {
  const userExist = await User.findOne({ user_type: "admin" });

  if (userExist) {
    console.log("An user exists as admin");
    return;
  }

  const user = new User({
    name: "Admin",
    email: "admin@gmail.com",
    password: "Admin@1234",
    user_type: "admin",
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (err) {
    console.log("Server Error in createAdmin", err);
  }
};

mongoose
  .connect("mongodb://localhost:27017/surveyDB", {})
  .then(async () => {
    console.log("Connected to the database!");
    await createAdmin();
    mongoose.disconnect();
    console.log("Disconnected from the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
