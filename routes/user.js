const express = require("express");
const router = express.Router();

const user = require("../controllers/user");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");

router.route("/").post(user.postUser);

router.route("/analytics").get(auth, user.getAnalytics);

module.exports = router;
