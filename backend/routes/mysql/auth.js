const express = require('express');
const { register, login, wechatLogin, wechatMobileLogin } = require('../../controllers/mysql/authController');

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// WeChat login route (using profile information)
router.post('/wechat-login', wechatLogin);

// WeChat mobile login route
router.post('/wechat-mobile-login', wechatMobileLogin);

module.exports = router;