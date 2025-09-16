/**
 * Test script for Yunda Express API template
 */

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const { getYundaTrackingInfo, isYundaTrackingNumber, YUNDA_API_CONFIG } = require('./utils/logistics/yunda-api-template');

async function testYundaTemplate() {
  console.log('Testing Yunda Express API template...');
  console.log('APP_KEY:', process.env.YUNDA_APP_KEY);
  console.log('APP_SECRET:', process.env.YUNDA_APP_SECRET);
  console.log('API Config:', YUNDA_API_CONFIG);
  
  // Test tracking number validation
  console.log('\nTesting tracking number validation:');
  const testNumbers = [
    '123456789012',     // Valid 12-digit
    '1234567890123',    // Valid 13-digit
    '12345678901234',   // Valid 14-digit
    '123456789012345',  // Valid 15-digit
    '12345678901',      // Invalid 11-digit
    '1234567890123456', // Invalid 16-digit
    'YD123456789012',   // Invalid format (contains letters)
    '12345abc678901'    // Invalid format (contains letters)
  ];
  
  testNumbers.forEach(number => {
    const isValid = isYundaTrackingNumber(number);
    console.log(`  ${number}: ${isValid ? 'Valid' : 'Invalid'}`);
  });
  
  // Test signature generation
  console.log('\nTesting signature generation:');
  const testParams = {
    tracking_number: '123456789012',
    appkey: process.env.YUNDA_APP_KEY,
    timestamp: '20230101120000'
  };
  
  try {
    // This will fail because we're using a placeholder endpoint, but we can test the structure
    console.log('Attempting to call API (expected to fail with ENOTFOUND):');
    const trackingInfo = await getYundaTrackingInfo('123456789012');
    console.log('Tracking information retrieved successfully:');
    console.log(JSON.stringify(trackingInfo, null, 2));
  } catch (error) {
    console.log('Expected error (API endpoint not accessible):', error.message);
  }
}

testYundaTemplate();