// cloudfunctions/addToCart/index.js
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
    
    // Check if product exists
    const productResult = await db.collection('products').doc(event.productId).get()
    
    if (!productResult.data) {
      return {
        success: false,
        error: 'Product not found'
      }
    }
    
    const product = productResult.data
    
    // Check if item already exists in cart
    const cartItemResult = await db.collection('cart_items').where({
      userId: user._id,
      productId: event.productId
    }).get()
    
    if (cartItemResult.data.length > 0) {
      // Update existing cart item
      const cartItem = cartItemResult.data[0]
      const newQuantity = cartItem.quantity + (event.quantity || 1)
      
      await db.collection('cart_items').doc(cartItem._id).update({
        data: {
          quantity: newQuantity,
          updatedAt: new Date()
        }
      })
      
      return {
        success: true,
        message: 'Cart item updated',
        cartItem: {
          ...cartItem,
          quantity: newQuantity
        }
      }
    } else {
      // Create new cart item
      const newCartItem = {
        userId: user._id,
        productId: event.productId,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity: event.quantity || 1,
        selected: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const createResult = await db.collection('cart_items').add({
        data: newCartItem
      })
      
      return {
        success: true,
        message: 'Item added to cart',
        cartItem: {
          _id: createResult._id,
          ...newCartItem
        }
      }
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}