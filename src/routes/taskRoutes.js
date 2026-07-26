// Routes related to Tasks.
//
// IMPORTANT: Express matches routes top to bottom. Specific routes like
// "/summary", "/new", "/progress", etc. MUST be declared BEFORE the
// dynamic "/:id" route, otherwise Express would treat "summary" or "new"
// as if they were a task id.

const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

// All task routes require the user to be logged in.
router.use(protect);

// Status-specific routes (must come before "/:id")
router.get("/summary", getTaskSummary);
router.get("/new", getNewTasks);
router.get("/progress", getProgressTasks);
router.get("/completed", getCompletedTasks);
router.get("/cancelled", getCancelledTasks);

// Main CRUD routes
router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
