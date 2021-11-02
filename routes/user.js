const express = require("express");
const router = express.Router();

const user = require("../controllers/user");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");

router
  .route("/")
  // .all(auth, policy.isAllowed) //.all(kHubPolicy.isAllowed) need to include policy
  //   .get(auth, policy.isAllowed, user.getUsers)
  .post(user.postUser);

router.route("/analytics").get(auth, user.getAnalytics);

// router
//   .route("/:id")
//   .all(validateObjectId) //add auth and policy
//   .get(auth, policy.isAllowed, user.getSingleUser)
//   .put([auth, policy.isAllowed, upload.single("image")], user.updateUser)
//   .delete(auth, policy.isAllowed, user.deleteUser);

module.exports = router;
