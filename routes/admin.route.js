const express = require('express');
const { sendNotification } = require('../controllers/admin.controller.js');
const authMiddleware = require('../middlewares/auth.js');  // Import auth middleware
const router = express.Router();

router.post('/send-notification', authMiddleware, sendNotification); // admin route to send notification

module.exports = router;
