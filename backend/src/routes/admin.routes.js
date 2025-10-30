const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const verifyJWT = require('../middlewares/auth.middleware');

// API
// get all users (admin only)
router.get('/users', verifyJWT, controller.getAllUsers);

// get all tasks for a specific user, grouped and sorted (admin only)
router.get('/users/:userId/tasks', verifyJWT, controller.getUserTasksGrouped);

module.exports = router;