const _ = require("lodash");
const bcrypt = require("bcrypt");
// const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
// const passwordComplexity = require("joi-password-complexity").default;
// const fs = require("fs");

const { User, validate } = require("../models/user");

// const DEFAULT_LANGUAGE = "en";

// exports.getUsers = async (req, res) => {
//   let ITEMS_PER_PAGE = 10000;
//   let query = {};
//   let languageCode = req.query.lang || DEFAULT_LANGUAGE;
//   const page = +req.query.page || 1;
//   let accessableUserTypes = common.getAccessibleUserTypes(req.user.user_type);
//   if (!_.isEmpty(accessableUserTypes)) {
//     query.user_type = { $in: accessableUserTypes };
//     if (
//       !_.isEmpty(req.query.user_type) &&
//       accessableUserTypes.includes(req.query.user_type)
//     ) {
//       query["user_type"] = req.query.user_type;
//     }
//   } else {
//     return res.status(400).json({ err: "You cannot access user details" });
//   }
//   if (!_.isEmpty(req.query.search)) {
//     query["name"] = { $regex: req.query.search, $options: "i" };
//   }

//   if (!_.isEmpty(req.query.limit)) ITEMS_PER_PAGE = +req.query.limit;
//   try {
//     const userCount = await User.count(query);
//     const allUsers = await User.find(query)
//       .skip((page - 1) * ITEMS_PER_PAGE)
//       .limit(ITEMS_PER_PAGE)
//       .select("-__v -password")
//       .lean();
//     if (_.isEmpty(allUsers)) return res.json({ msg: "No users found" });
//     allUsers.forEach((user) => {
//       if (user.user_type === "seller") {
//         if (_.isEmpty(user.earnings)) user.earnings = 0;
//         else {
//           let earnings = 0;
//           user.earnings.forEach((earning) => {
//             let totalPrice = earning.quantity * earning.price;
//             let shippingCost = earning.shippingCost;
//             if (earning.product_quantity_multiply) {
//               shippingCost = earning.quantity * earning.shippingCost;
//             }
//             earnings += totalPrice;
//           });
//           user.earnings = earnings;
//         }
//         if (_.isEmpty(user.payments)) user.payment = 0;
//         else {
//           let payment = 0;
//           user.payments.forEach((singlePayment) => {
//             payment += singlePayment.amount;
//           });
//           user.payment = payment;
//         }
//       }
//     });
//     return res.json({
//       users: allUsers,
//       info: {
//         totalNumber: userCount,
//         hasNextPage: ITEMS_PER_PAGE * page < userCount,
//         hasPreviousPage: page > 1,
//         nextPage: page + 1,
//         previousPage: page - 1,
//         lastPage: Math.ceil(userCount / ITEMS_PER_PAGE),
//       },
//     });
//   } catch (error) {
//     console.log("Server Error in user.getUsers", error);
//     return res.status(500).json({ err: "Server Error", path: "user.getUsers" });
//   }
// };

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

// exports.getSingleUser = async (req, res) => {
//   let accessableUserTypes = common.getAccessibleUserTypes(req.user.user_type);
//   accessableUserTypes.push(req.user.user_type);
//   let query = { _id: req.params.id };
//   let populateQuery = "";
//   let projectQuery = "-__v -password -address._id -createdAt -updatedAt";
//   if (!_.isEmpty(accessableUserTypes))
//     query.user_type = { $in: accessableUserTypes };
//   if (req.query.user_type === "user") {
//     projectQuery =
//       "-__v -password -active -role -shop_id -address._id -createdAt -updatedAt -cart._id -earnings -payments";
//     populateQuery = {
//       path: "cart.product_id",
//       select: " resourceBundle -_id prices product_image_small_url",
//     };
//   }
//   const user = await User.findOne(query)
//     .select(projectQuery)
//     .populate(populateQuery)
//     .lean();

//   if (!user)
//     return res.status(404).json({
//       err: "User not found",
//       msg: "The user with the given ID was not found.",
//     });

//   if (user.user_type === "seller") {
//     if (_.isEmpty(user.earnings)) user.earnings = 0;
//     else {
//       let earnings = 0;
//       user.earnings.forEach((earning) => {
//         let totalPrice = earning.quantity * earning.price;
//         let shippingCost = earning.shippingCost;
//         if (earning.product_quantity_multiply) {
//           shippingCost = earning.quantity * earning.shippingCost;
//         }
//         earnings += totalPrice;
//       });
//       user.earnings = earnings;
//     }
//     if (_.isEmpty(user.payments)) user.payment = 0;
//     else {
//       let payment = 0;
//       user.payments.forEach((singlePayment) => {
//         payment += singlePayment.amount;
//       });
//       user.payment = payment;
//     }
//   }

//   res.send(user);
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndRemove(req.params.id);

//     if (!user)
//       return res.status(404).json({
//         err: "User not found",
//         msg: "The user with the given ID was not found.",
//       });

//     if (user.image_url && fs.existsSync(user.image_url))
//       fs.unlinkSync(user.image_url);

//     //Transaction
//     await Order.deleteMany({ customer_id: req.params.id });

//     return res.send(user);
//   } catch (error) {
//     console.log("Server Error in user.deleteUser ", error);
//     return res
//       .status(500)
//       .json({ err: "Server Error", path: "user.deleteUser" });
//   }
// };

// exports.updateUser = async (req, res) => {
//   if (req.user.user_type === "user" && req.user._id != req.params.id) {
//     return res.json({ err: "You cannot update other user's details" });
//   }
//   if (_.isEmpty(req.body)) {
//     if (!req.file) return res.json({ err: "Bad request", msg: "Empty body" });
//   }
//   const { error } = validateUser(req.body);
//   if (error) {
//     deleteUploadedFiles(req.file);
//     return res.status(400).json({ err: error.details[0].message });
//   }
//   try {
//     if (!_.isEmpty(req.body.email)) {
//       const userExist = await User.findOne({ email: req.body.email });

//       if (userExist && userExist._id != req.params.id) {
//         deleteUploadedFiles(req.file);
//         return res
//           .status(400)
//           .json({ err: "User already exists with the same email" });
//       }
//     }
//     const {
//       name,
//       email,
//       password,
//       address,
//       card_info,
//       active,
//       language,
//       salary,
//       // commission_per_product,
//       shop_id,
//       user_type,
//       mobile,
//       // role
//     } = req.body;

//     //check if the user has autherisation to add this user type
//     if (!_.isEmpty(user_type) && user_type != "user") {
//       let type_priority = userTypeMap.find(
//         (type) => type.name == user_type
//       ).priority;
//       let current_user_type_priority = userTypeMap.find(
//         (type) => type.name == req.user.user_type
//       ).priority;
//       if (type_priority <= current_user_type_priority) {
//         return res.status(400).json({
//           err: `Cannot set user_type ${user_type} as you have no autherization`,
//         });
//       }
//     }

//     const existingUser = await User.findOne({ _id: req.params.id });
//     if (!existingUser)
//       return res.status(404).json({
//         err: "User not found",
//         msg: "The user with the given ID was not found.",
//       });

//     const userContent = {};

//     if (!_.isEmpty(name)) userContent.name = name;
//     if (!_.isEmpty(email)) userContent.email = email;
//     if (!_.isEmpty(password) && req.user.user_type !== "user") {
//       const salt = await bcrypt.genSalt(10);
//       userContent.password = await bcrypt.hash(password, salt);
//     }
//     if (!_.isEmpty(address)) userContent.address = address;

//     if (!_.isEmpty(mobile)) user.mobile = mobile;
//     if (!_.isEmpty(card_info)) userContent.card_info = card_info;
//     if (!_.isUndefined(active) && req.user.user_type !== "user")
//       userContent.active = active;
//     if (!_.isEmpty(language)) userContent.language = language;
//     if (
//       !_.isUndefined(salary) &&
//       req.user.user_type !== "user" &&
//       existingUser.user_type === "delivery_boy"
//     )
//       userContent.salary = salary;
//     if (!_.isEmpty(shop_id) && req.user.user_type !== "user")
//       userContent.shop_id = shop_id;
//     // if (!_.isEmpty(role)) userContent.role = role;
//     if (!_.isEmpty(user_type) && req.user.user_type !== "user") {
//       const doc = await Common.find();
//       if (
//         _.isEmpty(doc) ||
//         _.isEmpty(doc[0].user_role_map) ||
//         _.isEmpty(doc[0].user_role_map[user_type])
//       )
//         return res.status(400).json({
//           err: "Cannot find user role, contact admin",
//           errDetails: "The user role map not found",
//         });
//       const userMap = doc[0].user_role_map;
//       userContent.role = userMap[user_type];
//       userContent.user_type = user_type;
//     }

//     if (!_.isEmpty(req.file)) {
//       if (existingUser.image_url && fs.existsSync(existingUser.image_url))
//         fs.unlinkSync(existingUser.image_url);
//       userContent.image_url = req.file.path;
//     }
//     const user = await User.findByIdAndUpdate(req.params.id, userContent, {
//       new: true,
//     });

//     const token = user.generateAuthToken();

//     return res.send({ token });
//   } catch (error) {
//     console.log("Server Error in user.upadateUser", error);
//     return res
//       .status(500)
//       .json({ err: "Server Error", path: "user.upadateUser" });
//   }
// };

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
