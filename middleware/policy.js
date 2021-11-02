module.exports = function (req, res, next) {
  if (req.user.user_type !== "admin")
    return res.status(403).json({ err: "Not authorized" });

  next();
};
