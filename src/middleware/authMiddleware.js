const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    let token;

   
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, "Not authorized, no token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, "Not authorized, user not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, "Not authorized, invalid or expired token", 401);
  }
};

module.exports = protect;
