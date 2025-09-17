// cloudfunctions/wechatLogin/index.js
const cloud = require('wx-server-sdk')
const jwt = require('jsonwebtoken')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// Generate JWT token (same as in the HTTP API)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, username: user.username },
    'online-store-secret-key', // Same as JWT_SECRET in .env
    { expiresIn: '7d' }
  )
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // Extract user info and code from event
    const { userInfo, code } = event
    
    if (!userInfo) {
      return {
        success: false,
        error: 'Missing user info'
      }
    }
    
    // Check if user exists in cloud database
    const userResult = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()
    
    let user, isNewUser = false
    
    if (userResult.data.length > 0) {
      // User exists, update profile if needed
      user = userResult.data[0]
      
      // Update profile information
      await db.collection('users').doc(user._id).update({
        data: {
          username: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          updated_at: new Date()
        }
      })
      
      // Fetch updated user data
      const updatedUser = await db.collection('users').doc(user._id).get()
      user = updatedUser.data
    } else {
      // Create new user
      const newUser = {
        username: userInfo.nickName,
        password: 'wechat_user', // Placeholder password (not used for WeChat login)
        email: '', // Email is optional
        phone: '', // Phone is optional
        avatar: userInfo.avatarUrl,
        openid: wxContext.OPENID,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      const createResult = await db.collection('users').add({
        data: newUser
      })
      
      user = {
        _id: createResult._id,
        ...newUser
      }
      
      isNewUser = true
    }
    
    // Generate JWT token for consistent authentication
    const token = generateToken(user)
    
    // Return user data in the same format as the HTTP API
    const userResponse = {
      id: user._id || user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
    
    return {
      success: true,
      token: token,
      user: userResponse,
      isNewUser: isNewUser
    }
  } catch (error) {
    console.error('WeChat login error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}