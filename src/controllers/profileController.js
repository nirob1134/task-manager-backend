// This controller handles viewing/updating the logged-in user's profile,
// including uploading a profile picture.

const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// @route   GET /api/profile
// @desc    Get the logged-in user's profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    return sendSuccess(res, "Profile fetched successfully", {
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

// @route   PUT /api/profile
// @desc    Update firstName, lastName, phone
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Only update fields that were actually provided.
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return sendSuccess(res, "Profile updated successfully", {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/profile/photo
// @desc    Upload / update profile picture
// @access  Private
const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, "Please upload an image file", 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // If the user already had a profile picture, delete the old file
    // so we don't fill up the disk with unused images.
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, "..", user.profilePicture);
      fs.unlink(oldPath, (err) => {
        // Ignore error if the old file doesn't exist.
      });
    }

    // Save a relative path so it can be served as a static file.
    user.profilePicture = `/uploads/profile/${req.file.filename}`;
    await user.save();

    return sendSuccess(res, "Profile photo updated successfully", {
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateProfilePhoto };
