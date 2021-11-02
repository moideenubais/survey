const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");

const SurveySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    question_answers: [
      {
        question: String,
        answers: [String],
      },
    ],
    credit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", SurveySchema);

function validateSurvey(survey) {
  const schema = Joi.object({
    title: Joi.string().max(50).required(),
    credit: Joi.number().required(),
    description: Joi.string(),
    question_answers: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().required(),
          answers: Joi.array().items(Joi.string()).required(),
        }).required()
      )
      .required(),
  });

  return schema.validate(survey);
}

exports.Survey = Survey;
exports.validate = validateSurvey;
