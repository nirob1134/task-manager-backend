// This file defines the structure (schema) of a "User" document in MongoDB.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Simple regex to validate a proper email format.
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Never return password by default in queries.
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "", // Will store the relative path/URL of the uploaded image.
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields.
  }
);

module.exports = mongoose.model("User", userSchema);
