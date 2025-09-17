// cloudfunctions/getProducts/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // Get products based on filters
    let query = db.collection('products')
    
    // Apply category filter if provided
    if (event.category_id) {
      query = query.where({
        category_id: event.category_id
      })
    }
    
    // Apply featured filter if provided
    if (event.isFeatured !== undefined) {
      query = query.where({
        is_featured: event.isFeatured
      })
    }
    
    // Apply search filter if provided
    if (event.search) {
      query = query.where({
        name: db.RegExp({
          regexp: '.*' + event.search + '.*',
          options: 'i'
        })
      })
    }
    
    // Sort by creation date
    query = query.orderBy('created_at', 'desc')
    
    // Execute query
    const result = await query.get()
    
    return {
      success: true,
      products: result.data
    }
  } catch (error) {
    console.error('Get products error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}