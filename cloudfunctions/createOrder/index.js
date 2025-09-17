// cloudfunctions/createOrder/index.js
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
    
    // Validate order data
    if (!event.items || !Array.isArray(event.items) || event.items.length === 0) {
      return {
        success: false,
        error: 'Order items are required'
      }
    }
    
    // Calculate order totals
    let subtotal = 0
    for (const item of event.items) {
      subtotal += item.price * item.quantity
    }
    
    const shippingFee = event.shippingFee || 0
    const totalAmount = subtotal + shippingFee
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000)
    
    // Create order object
    const order = {
      user_id: user._id,
      order_number: orderNumber,
      items: event.items,
      subtotal: subtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address: event.shippingAddress || {},
      payment_method: event.paymentMethod || 'wechat_pay',
      payment_id: event.paymentId || '',
      tracking_number: '',
      estimated_delivery: null,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    // Save order to database
    const createResult = await db.collection('orders').add({
      data: order
    })
    
    // Clear cart items for this user
    await db.collection('cart_items').where({
      user_id: user._id
    }).remove()
    
    return {
      success: true,
      message: 'Order created successfully',
      order: {
        _id: createResult._id,
        ...order
      }
    }
  } catch (error) {
    console.error('Create order error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}