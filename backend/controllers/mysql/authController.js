const jwt = require('jsonwebtoken');
const User = require('../../models/mysql/User');
const { decryptWeChatData, getWeChatSession, simulateWeChatResponse } = require('../utils/wechat');
// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register controller
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username already exists' 
      });
    }
    
    // Create user
    const newUser = new User({
      username,
      password,
      email
    });
    
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};
// WeChat mobile login controller
const wechatMobileLogin = async (req, res) => {
  try {
    const { code, encryptedData, iv } = req.body;

    // Validate input
    if (!code || !encryptedData || !iv) {
      return res.status(400).json({ 
        message: 'Missing required parameters' 
      });
    }

    let phoneNumber, openid;

    // For development mode simulation
    const isDevelopment = process.env.NODE_ENV === 'development';

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
  register,
  login
};