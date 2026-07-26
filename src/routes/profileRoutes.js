// Routes related to the logged-in user's profile.

const express = require("express");
const router = express.Router();

const { getProfile, updateProfile, updateProfilePhoto } = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// All profile routes require the user to be logged in.
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.put("/photo", protect, upload.single("profilePicture"), updateProfilePhoto);

module.exports = router;
