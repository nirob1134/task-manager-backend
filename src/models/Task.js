// This file defines the structure (schema) of a "Task" document in MongoDB.

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links this task to a specific user.
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Progress", "Completed", "Cancelled"],
      default: "New",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields.
  }
);

module.exports = mongoose.model("Task", taskSchema);
