const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');
const verifyJWT = require('../middlewares/auth.middleware');

// API
// create task
router.post('/', controller.createTask); // , verifyJWT

// get all tasks (supports query filters: userId, taskStatus)
router.get('/', verifyJWT, controller.getAllTasks);

// get single task by id
router.get('/:id', verifyJWT, controller.getTaskById);

// update task by id
router.put('/:id', verifyJWT, controller.updateTask);

// delete task by id
router.delete('/:id', verifyJWT, controller.deleteTask);

module.exports = router;