const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/auth.middleware');

// API 
router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/logout', verifyJWT, controller.logoutUser);

router.post('/refresh-access-token', controller.refreshAccessToken);

// get single user
router.get('/user/:id', verifyJWT, controller.getUser);

// get logged in user
router.get('/', verifyJWT, controller.getLoggedInUser);

// update users info
router.put('/update-info', verifyJWT, controller.updateUserInfo)



module.exports = router;