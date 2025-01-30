const express = require('express');
const { updateProfile, sendNotification } = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.js');  // Import auth middleware
const router = express.Router();

router.put('/profile', authMiddleware, updateProfile); // route to update user profile
router.post('/send-notification', authMiddleware, sendNotification); // route to send notification by user

module.exports = router;
