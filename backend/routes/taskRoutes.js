const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// All task routes require authentication
router.use(auth);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
