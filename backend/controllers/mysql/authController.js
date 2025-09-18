const jwt = require('jsonwebtoken');
const User = require('../../models/mysql/User');
const { decryptWeChatData, getWeChatSession, simulateWeChatResponse } = require('../../utils/wechat');
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

// WeChat login controller (using profile information)
const wechatLogin = async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    // Validate input
    if (!code || !userInfo) {
      return res.status(400).json({ 
        message: 'Missing required parameters' 
      });
    }
    
    let openid;
    
    // For development mode simulation
    // Force development mode for testing
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
    
    if (isDevelopment) {
      // In development, simulate WeChat response
      console.log('Development mode: simulating WeChat response');
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
      // Check if user with same username already exists
      const existingUser = await User.findOne({ username: userInfo.nickName });
      if (existingUser) {
        // If username exists, append a number to make it unique
        let username = userInfo.nickName;
        let counter = 1;
        while (await User.findOne({ username: username })) {
          username = `${userInfo.nickName}_${counter}`;
          counter++;
        }
        userInfo.nickName = username;
      }
      
      // Create new user with WeChat profile information
      console.log('Creating user with data:', {
        username: userInfo.nickName,
        password: 'wechat_user',
        email: '',
        phone: '',
        wechatOpenId: openid,
        avatar: userInfo.avatarUrl
      });

      user = new User({
        username: userInfo.nickName,
        password: 'wechat_user', // Placeholder password (not used for WeChat login)
        email: '', // Email is optional
        phone: '', // Phone is optional
        wechatOpenId: openid,
        avatar: userInfo.avatarUrl
      });

      console.log('Before saving user:', user);

      await user.save();

      console.log('After saving user:', user);
      console.log('User ID after save:', user.id, 'Type:', typeof user.id);
    } else {
      // Update user profile information if it has changed
      let needsUpdate = false;
      
      if (user.username !== userInfo.nickName) {
        // Check if the new username is available
        const existingUser = await User.findOne({ username: userInfo.nickName });
        if (!existingUser) {
          user.username = userInfo.nickName;
          needsUpdate = true;
        }
      }
      
      if (user.avatar !== userInfo.avatarUrl) {
        user.avatar = userInfo.avatarUrl;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await user.save();
      }
      
      console.log('Existing user ID:', user.id, 'Type:', typeof user.id);
    }
    
    // Generate token using the database-generated ID
    console.log('Generating token for user with ID:', user.id, 'Type:', typeof user.id);
    const token = generateToken(user);
    
    // Return user data with the correct ID type
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    
    console.log('User response ID:', userResponse.id, 'Type:', typeof userResponse.id);
    
    res.json({
      message: 'WeChat login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('WeChat login error:', error);
    
    if (error.message && error.message.includes('session')) {
      return res.status(400).json({ 
        message: 'Failed to establish WeChat session. Please try again.' 
      });
    }
    
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
      // Generate a unique username based on phone number
      let username = `user_${phoneNumber}`;
      let counter = 1;
      while (await User.findOne({ username: username })) {
        username = `user_${phoneNumber}_${counter}`;
        counter++;
      }
      
      user = new User({
        username: username,
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

    // Generate token using the database-generated ID
    const token = generateToken(user);

    // Return user data with the correct ID type
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      message: 'WeChat mobile login successful',
      token,
      user: userResponse
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
  login,
  wechatLogin,
  wechatMobileLogin
};