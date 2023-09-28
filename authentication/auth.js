require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, process.env.JSONWEB_SECRET_KEY);
    const finduser = await User.findOne({ _id: user.userId });
    req.user = finduser;
    next();
  } catch (err) {
    console.log(err);
    return res.status(200).json({ success: false });
  }
};
