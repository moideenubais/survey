const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User, validate } = require("../models/user");

exports.postUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    deleteUploadedFiles(req.file);
    return res
      .status(400)
      .json({ err: "User already exists with the same email" });
  }

  const { name, email, password, user_type } = req.body;

  const user = new User({
    name,
    email,
    password,
    user_type: "user",
  });

  if (!_.isEmpty(user_type)) user.user_type = user_type;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    return res.json({ token: token });
  } catch (err) {
    console.log("Server Error in user.postUser", err);
    return res.status(400).json({ err: "Server Error", path: "user.postUser" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userCount = await User.count();
    const responds = await User.aggregate([
      {
        $project: {
          name: 1,
          count: { $size: { $ifNull: ["$survey_completed", []] } },
        },
      },
    ]);
    res.json({ userCount, responds });
  } catch (error) {
    console.log("error in user.getAnalytics", error);
    return res.status(500).json({ err: "Server error" });
  }
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(50),
    email: Joi.string().email(),
    password: passwordComplexity(),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .label("confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
    user_type: Joi.string().valid("user", "admin"),
  });

  return schema.validate(user);
}
