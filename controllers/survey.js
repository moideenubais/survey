const { Survey, validate } = require("../models/survey");
const _ = require("lodash");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const fs = require("fs");

const { User } = require("../models/user");

exports.createSurvey = async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }

  const newSurvey = new Survey({
    title: req.body.title,
    question_answers: req.body.question_answers,
    credit: req.body.credit,
  });

  if (!_.isEmpty(req.body.description))
    newSurvey.description = req.body.description;

  try {
    await newSurvey.save();

    res.json({ msg: "success", msgDetails: "Survey creation successful" });
  } catch (error) {
    console.log("Server Error in survey.createSurvey", error);
    res.status(500).json({ err: "Server Error", path: "survey.createSurvey" });
  }
};

exports.listSurveys = async (req, res) => {
  let ITEMS_PER_PAGE = 10000;
  let query = {};
  const page = +req.query.page || 1;
  if (!_.isEmpty(req.query.search)) {
    query["title"] = {
      $regex: req.query.search,
      $options: "i",
    };
  }
  if (req.user.user_type === "user") {
    const user = await User.findById(req.user._id);
    const surveyCompleted = [];
    if (!_.isEmpty(user.survey_completed)) {
      user.survey_completed.forEach((survey) => {
        surveyCompleted.push(survey.survey);
      });
    }
    query["_id"] = { $nin: surveyCompleted };
  }

  if (!_.isEmpty(req.query.limit)) ITEMS_PER_PAGE = +req.query.limit;
  try {
    const surveyCount = await Survey.count(query);
    const allSurveys = await Survey.find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort("-createdAt")
      .select("-__v")
      .lean();
    if (_.isEmpty(allSurveys)) return res.json({ msg: "No surveys found" });
    return res.json({
      surveys: allSurveys,
      info: {
        totalNumber: surveyCount,
        hasNextPage: ITEMS_PER_PAGE * page < surveyCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(surveyCount / ITEMS_PER_PAGE),
      },
    });
  } catch (error) {
    console.log("Server Error in survey.getSurveys", error);
    return res
      .status(500)
      .json({ err: "Server Error", path: "survey.getSurveys" });
  }
};

exports.getSingleSurvey = async (req, res) => {
  if (req.user.user_type === "user") {
    const surveyCompleted = await User.findOne({
      _id: req.user._id,
      "survey_completed.survey": req.params.id,
    });
    if (surveyCompleted)
      return res.status(400).json({ err: "Survey already completed" });
  }
  const survey = await Survey.findById(req.params.id).select("-__v").lean();

  if (!survey)
    return res.status(404).json({
      err: "Survey not found",
      msg: "The survey with the given ID was not found.",
    });

  res.send(survey);
};

exports.deleteSurvey = async (req, res) => {
  try {
    const surveyExist = await Survey.findOne({ _id: req.params.id });
    if (!surveyExist)
      return res.status(404).json({
        err: "Survey not found",
        msg: "The survey with the given ID was not found.",
      });

    const survey = await Survey.findByIdAndRemove(req.params.id);

    res.send(survey);
  } catch (error) {
    console.log("Server Error in survey.deleteSurvey", error);
    return res
      .status(400)
      .json({ err: "Server Error", path: "survey.deleteSurvey" });
  }
};

exports.updateSurvey = async (req, res) => {
  if (_.isEmpty(req.body)) {
    if (!req.files) return res.json({ err: "Bad request", msg: "Empty body" });
  }
  const { error } = validateSurvey(req.body);

  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }

  const surveyContent = {};
  const currentSurvey = await Survey.findOne({ _id: req.params.id });
  if (!currentSurvey)
    return res.json({
      err: "Survey not found",
      msg: "Survey with the given id not found",
    });

  if (!_.isEmpty(req.body.title)) {
    surveyContent.title = req.body.title;
  }
  if (!_.isEmpty(req.body.credit)) {
    surveyContent.credit = req.body.credit;
  }

  if (!_.isEmpty(req.body.description)) {
    surveyContent.description = req.body.description;
  }

  if (!_.isEmpty(req.body.question_answers)) {
    surveyContent.question_answers = req.body.question_answers;
  }

  const survey = await Survey.findByIdAndUpdate(req.params.id, surveyContent, {
    new: true,
  });

  res.send(survey);
};

exports.submitSurvey = async (req, res) => {
  if (_.isEmpty(req.body)) {
    if (!req.files) return res.json({ err: "Bad request", msg: "Empty body" });
  }
  const { error } = validateSurveySubmit(req.body);

  if (error) {
    return res.status(400).json({ err: error.details[0].message });
  }

  const surveyCompleted = await User.findOne({
    _id: req.user._id,
    "survey_completed.survey": req.params.id,
  });

  if (surveyCompleted) {
    return res.status(400).json({ err: "Survey completed already" });
  }

  const survey = await Survey.findById(req.params.id);

  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      survey_completed: {
        survey: survey._id,
        question_answers: req.body.question_answers,
      },
    },
    $inc: { wallet: survey.credit },
  });

  res.json({ msg: "success", msgDetails: "Survey submitted successfully" });
};

exports.getAnalytics = async (req, res) => {
  try {
    const surveyCount = await Survey.count();
    const responds = await User.aggregate([
      { $unwind: "$survey_completed" },
      {
        $group: {
          _id: { surveyId: "$survey_completed.survey" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "surveys",
          localField: "_id.surveyId",
          foreignField: "_id",
          as: "survey",
        },
      },
    ]);
    res.json({ surveyCount, responds });
  } catch (error) {
    console.log("error in survey.getAnalytics", error);
    return res.status(500).json({ err: "Server error" });
  }
};

function validateSurveySubmit(survey) {
  const schema = Joi.object({
    question_answers: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      }).required()
    ),
  });

  return schema.validate(survey);
}
function validateSurvey(survey) {
  const schema = Joi.object({
    title: Joi.string().max(50),
    credit: Joi.number(),
    description: Joi.string(),
    question_answers: Joi.array().items(
      Joi.object({
        _id: Joi.objectId(),
        question: Joi.string().required(),
        answers: Joi.array().items(Joi.string()).required(),
      }).required()
    ),
  });

  return schema.validate(survey);
}
