const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const path = require("path");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  let user = await User.findOne({ email: req.body.email.trim() });
  if (!user)
    return res.status(400).json({ msg: "Invalid username or password." });

  const validPassword = await bcrypt.compare(
    req.body.password.trim(),
    user.password
  );
  if (!validPassword)
    return res.status(400).json({ msg: "Invalid username or password." });

  const token = user.generateAuthToken();
  res.json({ token: token });
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
  });

  return schema.validate(user);
}

module.exports = router;
