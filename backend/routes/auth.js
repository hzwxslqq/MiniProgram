const express = require('express');
const { wechatLogin, wechatMobileLogin } = require('../controllers/authController');

const router = express.Router();

// WeChat authorization login route
router.post('/wechat-login', wechatLogin);

// WeChat mobile login route
router.post('/wechat-mobile-login', wechatMobileLogin);

module.exports = router;