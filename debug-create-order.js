// Debug the createOrder function
const Product = require('./backend/models/mysql/Product');

async function debugCreateOrder() {
  try {
    console.log('=== DEBUGGING CREATE ORDER FUNCTION ===');
    
    // Simulate the items array from the frontend
    const items = [
      {
        productId: '1',
        quantity: 1
      }
    ];
    
    console.log('Input items:', items);
    
    // Simulate the enrichment logic
    let subtotal = 0;
    const enrichedItems = [];
    
    console.log('\nEnriching items...');
    for (const item of items) {
      console.log('Looking up product with ID:', item.productId);
      const product = await Product.findById(item.productId);
      console.log('Product found:', product);
      
      if (product) {
        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;
        console.log('Item total:', itemTotal, 'Running subtotal:', subtotal);
        
        // Enrich item with product information
        const enrichedItem = {
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          quantity: item.quantity,
          price: parseFloat(product.price)
        };
        
        console.log('Enriched item:', enrichedItem);
        enrichedItems.push(enrichedItem);
      }
    }
    
    console.log('\nFinal results:');
    console.log('Enriched items:', enrichedItems);
    console.log('Subtotal:', subtotal);
    console.log('Shipping fee (for subtotal < 100):', subtotal >= 100 ? 0 : 5.99);
    console.log('Total amount:', subtotal + (subtotal >= 100 ? 0 : 5.99));
    
  } catch (error) {
    console.error('Error in debug:', error);
  }
}

debugCreateOrder();