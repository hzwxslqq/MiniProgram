// cloudfunctions/getCart/index.js
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
    
    if (userResult.data.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }
    
    const user = userResult.data[0]
    
    // Get cart items for this user
    const cartItemsResult = await db.collection('cart_items').where({
      userId: user._id
    }).get()
    
    return {
      success: true,
      cartItems: cartItemsResult.data
    }
  } catch (error) {
    console.error('Get cart items error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}