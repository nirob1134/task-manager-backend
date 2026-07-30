// Routes related to authentication: register, login, profile, logout.

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");


router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, getMe);

router.post("/logout", protect, logout);


module.exports = router;