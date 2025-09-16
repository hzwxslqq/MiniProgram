/**
 * Test script for Yunda Express integration
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const { getYundaTrackingInfo } = require('./utils/logistics/yunda');

async function testYundaIntegration() {
  console.log('Testing Yunda Express integration...');
  console.log('APP_KEY:', process.env.YUNDA_APP_KEY);
  console.log('APP_SECRET:', process.env.YUNDA_APP_SECRET);
  
  try {
    const trackingInfo = await getYundaTrackingInfo('123456789012');
    console.log('Tracking information retrieved successfully:');
    console.log(JSON.stringify(trackingInfo, null, 2));
  } catch (error) {
    console.error('Error retrieving tracking information:', error.message);
  }
}

testYundaIntegration();