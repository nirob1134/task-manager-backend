// Routes related to authentication: register, login, get logged-in user.

const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getMe);

module.exports = router;
