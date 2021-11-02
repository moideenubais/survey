const express = require("express");
const router = express.Router();

const survey = require("../controllers/survey");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const policy = require("../middleware/policy");

router
  .route("/")
  .all(auth)
  .get(survey.listSurveys)
  .post(policy, survey.createSurvey);

router.route("/analytics").get(auth, survey.getAnalytics);
router.route("/submitSurvey/:id").post(auth, survey.submitSurvey);

router
  .route("/:id")
  .all(validateObjectId, auth)
  .get(survey.getSingleSurvey)
  .put(policy, survey.updateSurvey)
  .delete(policy, survey.deleteSurvey);

module.exports = router;
