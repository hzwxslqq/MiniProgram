const express = require('express');
const { register, login, wechatMobileLogin } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// WeChat mobile login route
router.post('/wechat-mobile-login', wechatMobileLogin);

module.exports = router;