const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    survey_completed: [
      {
        survey: {
          type: mongoose.Schema.ObjectId,
          ref: "Survey",
        },
        question_answers: [
          {
            question: String,
            answer: String,
          },
        ],
        date: Date,
      },
    ],
    wallet: {
      type: Number,
      default: 0,
      // required: isDeliveryBoy,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      user_type: this.user_type,
    },
    process.env.JWT_KEY
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
    user_type: Joi.string().valid("user", "admin"),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
