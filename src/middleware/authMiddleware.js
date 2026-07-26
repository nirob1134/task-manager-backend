// This middleware protects routes by verifying the JWT token sent by the client.
// If the token is valid, it attaches the logged-in user to req.user.

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    let token;

    // We expect the token in the header like: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, "Not authorized, no token provided", 401);
    }

    // Verify the token using our secret key.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach it to the request (excluding the password).
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
