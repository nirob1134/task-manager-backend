// This controller handles user registration, login, and fetching the
// logged-in user's basic info (via GET /api/auth/profile).

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// Helper function to generate a JWT for a given user id.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Basic input validation.
    if (!firstName || !lastName || !email || !password) {
      return sendError(res, "Please provide firstName, lastName, email and password", 400);
    }

    // Check if a user with this email already exists.
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, "A user with this email already exists", 400);
    }

    // Hash the password before saving it to the database.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      "User registered successfully",
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
        },
        token,
      },
      201
    );
  } catch (error) {
    next(error); // Passes the error to our errorHandler middleware.
  }
};

// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Please provide email and password", 400);
    }

    // We need .select("+password") because the schema hides password by default.
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = generateToken(user._id);

    return sendSuccess(res, "Login successful", {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @desc    Get logged-in user's info (req.user is set by authMiddleware)
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return sendSuccess(res, "User fetched successfully", {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };



// Logout
const logout = async (req, res, next) => {
  try {
    return sendSuccess(
      res,
      "Logout successful",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
