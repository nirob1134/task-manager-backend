// This controller handles everything related to Tasks:
// create, read, update, delete, search/filter/pagination,
// status-based routes, and a summary count.

const Task = require("../models/Task");
const { sendSuccess, sendError } = require("../utils/response");

// @route   POST /api/tasks
// @desc    Create a new task for the logged-in user
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return sendError(res, "Task title is required", 400);
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status, // If undefined, the schema default ("New") will be used.
    });

    return sendSuccess(res, "Task created successfully", task, 201);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user.
//          Supports: search by title, filter by status, pagination.
// @access  Private
// Example: /api/tasks?page=1&limit=10&status=Completed&search=node
const getTasks = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // Always scope the query to the logged-in user.
    const query = { user: req.user._id };

    // Search by title (case-insensitive partial match).
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by status, if provided.
    if (status) {
      query.status = status;
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
      Task.countDocuments(query),
    ]);

    return sendSuccess(res, "Tasks fetched successfully", {
      tasks,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks/:id
// @desc    Get a single task by id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    return sendSuccess(res, "Task fetched successfully", task);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task's title, description, status
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    return sendSuccess(res, "Task updated successfully", task);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    return sendSuccess(res, "Task deleted successfully", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// Helper function used by all 4 status-based routes below,
// so we don't repeat the same logic four times.
const getTasksByStatus = (status) => {
  return async (req, res, next) => {
    try {
      const tasks = await Task.find({ user: req.user._id, status }).sort({ createdAt: -1 });
      return sendSuccess(res, `${status} tasks fetched successfully`, tasks);
    } catch (error) {
      next(error);
    }
  };
};

// @route   GET /api/tasks/new
const getNewTasks = getTasksByStatus("New");

// @route   GET /api/tasks/progress
const getProgressTasks = getTasksByStatus("Progress");

// @route   GET /api/tasks/completed
const getCompletedTasks = getTasksByStatus("Completed");

// @route   GET /api/tasks/cancelled
const getCancelledTasks = getTasksByStatus("Cancelled");

// @route   GET /api/tasks/summary
// @desc    Get a count of tasks grouped by status, using aggregation
// @access  Private
const getTaskSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Group all of this user's tasks by their "status" field and count each group.
    const results = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Build a summary object with default zero counts.
    const summary = { new: 0, progress: 0, completed: 0, cancelled: 0 };

    results.forEach((item) => {
      const key = item._id.toLowerCase(); // "New" -> "new", "Progress" -> "progress", etc.
      if (summary[key] !== undefined) {
        summary[key] = item.count;
      }
    });

    const total = summary.new + summary.progress + summary.completed + summary.cancelled;

    return sendSuccess(res, "Task summary fetched successfully", { ...summary, total });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getNewTasks,
  getProgressTasks,
  getCompletedTasks,
  getCancelledTasks,
  getTaskSummary,
};
