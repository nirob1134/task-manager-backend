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

router.use(protect);


router.get("/summary", getTaskSummary);
router.get("/new", getNewTasks);
router.get("/progress", getProgressTasks);
router.get("/completed", getCompletedTasks);
router.get("/cancelled", getCancelledTasks);


router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
