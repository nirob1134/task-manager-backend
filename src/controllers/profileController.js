const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");


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


const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

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


const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, "Please upload an image file", 400);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Delete previous image from Cloudinary
    if (user.profilePicture) {
      const publicId = user.profilePicture
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Old image could not be deleted.");
      }
    }

    user.profilePicture = req.file.path;

    await user.save();

    return sendSuccess(res, "Profile photo updated successfully", {
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getProfile, updateProfile, updateProfilePhoto };
