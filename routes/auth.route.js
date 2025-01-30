const express = require('express');
const { register, login } = require('../controllers/auth.controller.js');
const router = express.Router();

router.post('/register', register); // route for user registration
router.post('/login', login); // route for user login

module.exports = router;
