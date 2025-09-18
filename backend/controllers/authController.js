const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { decryptWeChatData, getWeChatSession, verifyWeChatSignature, simulateWeChatResponse } = require('../utils/wechat');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// WeChat authorization login controller
const wechatLogin = async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    // Validate input
    if (!userInfo) {
      return res.status(400).json({ 
        message: 'Missing user info' 
      });
    }
    
    // For development mode simulation
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let openid;
    
    if (isDevelopment) {
      // In development, use simulated openid
      openid = 'simulated_openid_' + Date.now();
    } else {
      try {
        // Get WeChat session (openid and session_key)
        const sessionData = await getWeChatSession(code);
        
        if (!sessionData || !sessionData.openid) {
          return res.status(500).json({ 
            message: 'Failed to get WeChat session information' 
          });
        }
        
        openid = sessionData.openid;
      } catch (wechatError) {
        console.error('WeChat API error:', wechatError);
        
        // If WeChat API fails, fall back to simulation in development
        if (isDevelopment) {
          console.log('WeChat API failed, simulating response in development mode');
          openid = 'simulated_openid_' + Date.now();
        } else {
          return res.status(500).json({ 
            message: 'WeChat authorization failed: ' + (wechatError.message || 'Unknown error') 
          });
        }
      }
    }
    
    // Find user by WeChat openid
    let user = await User.findOne({ wechatOpenId: openid });
    
    if (!user) {
      // Create new user with WeChat profile info
      user = new User({
        username: userInfo.nickName || `user_${Date.now()}`,
        password: 'wechat_user', // Placeholder password (not used for WeChat login)
        email: '', // Email is optional
        phone: '', // Phone is optional
        avatar: userInfo.avatarUrl || '',
        wechatOpenId: openid
      });
      
      await user.save();
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data in the same format as the cloud function
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };
    
    res.json({
      success: true,
      token: token,
      user: userResponse
    });
  } catch (error) {
    console.error('WeChat login error:', error);
    
    res.status(500).json({ 
      message: 'WeChat login failed: ' + (error.message || 'Unknown error')
    });
  }
};

// WeChat mobile login controller
const wechatMobileLogin = async (req, res) => {
  try {
    const { code, encryptedData, iv } = req.body;
    
    // Validate input
    if (!code) {
      return res.status(400).json({ 
        message: 'Missing authorization code' 
      });
    }
    
    // For development mode simulation
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let phoneNumber, openid;
    
    // Handle case where user didn't authorize phone number access
    if (!encryptedData || !iv) {
      return res.status(400).json({ 
        message: 'Phone number authorization is required for mobile login. Please tap the button again and authorize access.' 
      });
    }
    
    if (isDevelopment) {
      // In development, simulate WeChat response
      console.log('Development mode: simulating WeChat response');
      const simulatedData = simulateWeChatResponse();
      phoneNumber = simulatedData.phoneNumber;
      openid = 'simulated_openid_' + Date.now();
    } else {
      try {
        // Get WeChat session (openid and session_key)
        const sessionData = await getWeChatSession(code);
        
        if (!sessionData || !sessionData.openid || !sessionData.sessionKey) {
          return res.status(500).json({ 
            message: 'Failed to get WeChat session information' 
          });
        }
        
        const { openid: wxOpenId, sessionKey } = sessionData;
        openid = wxOpenId;
        
        // Decrypt the phone number data
        const decryptedData = decryptWeChatData(sessionKey, encryptedData, iv);
        
        if (!decryptedData || !decryptedData.phoneNumber) {
          return res.status(400).json({ 
            message: 'Failed to decrypt phone number. Please try again.' 
          });
        }
        
        phoneNumber = decryptedData.phoneNumber;
      } catch (wechatError) {
        console.error('WeChat API error:', wechatError);
        
        // If WeChat API fails, fall back to simulation in development
        if (isDevelopment) {
          console.log('WeChat API failed, simulating response in development mode');
          const simulatedData = simulateWeChatResponse();
          phoneNumber = simulatedData.phoneNumber;
          openid = 'simulated_openid_' + Date.now();
        } else {
          return res.status(500).json({ 
            message: 'WeChat authorization failed: ' + (wechatError.message || 'Unknown error') 
          });
        }
      }
    }
    
    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ 
        message: 'Unable to retrieve phone number. Please ensure you authorized access and try again.' 
      });
    }
    
    // Find user by WeChat openid or phone number
    let user = await User.findOne({ 
      $or: [
        { wechatOpenId: openid },
        { phone: phoneNumber }
      ]
    });
    
    if (!user) {
      // Create new user with phone number
      user = new User({
        username: `user_${Date.now()}`, // Generate unique username
        password: 'wechat_mobile_user', // Placeholder password (not used for mobile login)
        phone: phoneNumber,
        wechatOpenId: openid,
        email: '' // Email is optional for mobile login
      });
      
      await user.save();
    } else if (!user.wechatOpenId) {
      // If user exists but doesn't have WeChat openid, update it
      user.wechatOpenId = openid;
      await user.save();
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      message: 'WeChat mobile login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('WeChat mobile login error:', error);
    
    // Provide more specific error messages based on error type
    if (error.message && error.message.includes('decrypt')) {
      return res.status(400).json({ 
        message: 'Failed to decrypt phone number data. Please try again.' 
      });
    }
    
    if (error.message && error.message.includes('session')) {
      return res.status(400).json({ 
        message: 'Failed to establish WeChat session. Please try again.' 
      });
    }
    
    res.status(500).json({ 
      message: 'WeChat mobile login failed: ' + (error.message || 'Unknown error')
    });
  }
};

module.exports = {
  wechatLogin,
  wechatMobileLogin
};