const crypto = require('crypto');
const axios = require('axios');

// Decrypt WeChat encrypted data
const decryptWeChatData = (sessionKey, encryptedData, iv) => {
  try {
    // Validate inputs
    if (!sessionKey || !encryptedData || !iv) {
      throw new Error('Missing required parameters for decryption');
    }
    
    // Decode base64 strings
    const sessionKeyBuffer = Buffer.from(sessionKey, 'base64');
    const encryptedDataBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    
    // Validate decoded data
    if (sessionKeyBuffer.length !== 16) {
      throw new Error('Invalid session key length');
    }
    
    if (ivBuffer.length !== 16) {
      throw new Error('Invalid iv length');
    }
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuffer, ivBuffer);
    decipher.setAutoPadding(true);
    
    // Decrypt data
    let decoded = decipher.update(encryptedDataBuffer, null, 'utf8');
    decoded += decipher.final('utf8');
    
    // Parse JSON result
    const result = JSON.parse(decoded);
    
    // Validate result contains required fields
    if (!result.phoneNumber) {
      throw new Error('Decrypted data does not contain phone number');
    }
    
    return result;
  } catch (error) {
    console.error('WeChat data decryption error:', error);
    throw new Error('Failed to decrypt WeChat data: ' + error.message);
  }
};

// Get WeChat session key and openid
const getWeChatSession = async (code) => {
  try {
    // Validate input
    if (!code) {
      throw new Error('Authorization code is required');
    }
    
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;
    
    if (!appId || !appSecret) {
      throw new Error('WeChat app credentials not configured');
    }
    
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
    
    const response = await axios.get(url, { timeout: 10000 }); // 10 second timeout
    const data = response.data;
    
    // Check for WeChat API errors
    if (data.errcode) {
      let errorMsg = `WeChat API error: ${data.errmsg || 'Unknown error'} (code: ${data.errcode})`;
      
      // Provide more specific error messages for common error codes
      switch (data.errcode) {
        case 40013:
          errorMsg = 'Invalid AppID';
          break;
        case 40029:
          errorMsg = 'Invalid code';
          break;
        case 40125:
          errorMsg = 'Invalid AppSecret';
          break;
        case 45011:
          errorMsg = 'API call frequency limit reached. Please try again later.';
          break;
        case -1:
          errorMsg = 'System busy. Please try again later.';
          break;
      }
      
      throw new Error(errorMsg);
    }
    
    // Validate response contains required fields
    if (!data.openid) {
      throw new Error('WeChat API response missing openid');
    }
    
    if (!data.session_key) {
      throw new Error('WeChat API response missing session_key');
    }
    
    return {
      openid: data.openid,
      sessionKey: data.session_key
    };
  } catch (error) {
    console.error('WeChat session error:', error);
    
    // Provide more user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your network connection.');
    }
    
    if (error.response && error.response.status) {
      if (error.response.status === 404) {
        throw new Error('WeChat API endpoint not found.');
      }
      if (error.response.status >= 500) {
        throw new Error('WeChat server error. Please try again later.');
      }
    }
    
    throw new Error('Failed to get WeChat session: ' + error.message);
  }
};

// Verify WeChat signature
const verifyWeChatSignature = (rawData, sessionKey, signature) => {
  try {
    if (!rawData || !sessionKey || !signature) {
      console.warn('Missing parameters for signature verification');
      return false;
    }
    
    const sha1 = crypto.createHash('sha1');
    sha1.update(rawData + sessionKey);
    const calculatedSignature = sha1.digest('hex');
    
    return calculatedSignature === signature;
  } catch (error) {
    console.error('WeChat signature verification error:', error);
    return false;
  }
};

// For development/testing purposes, we can simulate the WeChat response
const simulateWeChatResponse = () => {
  return {
    phoneNumber: '+8613800138000',
    purePhoneNumber: '13800138000',
    countryCode: '86',
    watermark: {
      appid: process.env.WECHAT_APP_ID || 'test_app_id',
      timestamp: Math.floor(Date.now() / 1000)
    }
  };
};

module.exports = {
  decryptWeChatData,
  getWeChatSession,
  verifyWeChatSignature,
  simulateWeChatResponse
};