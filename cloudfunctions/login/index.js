// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // Check if user exists
    const userResult = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()
    
    if (userResult.data.length > 0) {
      // User exists, return user info
      return {
        success: true,
        user: userResult.data[0]
      }
    } else {
      // Create new user
      const newUser = {
        openid: wxContext.OPENID,
        nickname: event.nickname || 'Anonymous',
        avatarUrl: event.avatarUrl || '',
        createdAt: new Date()
      }
      
      const createResult = await db.collection('users').add({
        data: newUser
      })
      
      return {
        success: true,
        user: {
          _id: createResult._id,
          ...newUser
        }
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}