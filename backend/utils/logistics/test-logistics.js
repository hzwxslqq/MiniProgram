/**
 * Test script for logistics integration
 * 
 * Run this script to test the logistics integration:
 * node test-logistics.js [tracking_number]
 * 
 * If no tracking number is provided, it will use a sample number
 */

const { getTrackingInfo, validateTrackingNumber } = require('./index');

async function testLogisticsIntegration(trackingNumber = '123456789012') {
  console.log(`Testing logistics integration with tracking number: ${trackingNumber}`);
  
  // Validate tracking number
  console.log('\n1. Validating tracking number...');
  const validation = validateTrackingNumber(trackingNumber);
  console.log('Validation result:', JSON.stringify(validation, null, 2));
  
  if (!validation.isValid) {
    console.log('Invalid tracking number. Exiting.');
    return;
  }
  
  // Get tracking info
  console.log('\n2. Fetching tracking information...');
  try {
    const trackingInfo = await getTrackingInfo(trackingNumber);
    console.log('Tracking information:');
    console.log(JSON.stringify(trackingInfo, null, 2));
  } catch (error) {
    console.error('Error fetching tracking information:', error.message);
  }
  
  // Test with carrier specified
  console.log('\n3. Testing with explicit carrier...');
  try {
    const trackingInfo = await getTrackingInfo(trackingNumber, 'Yunda Express');
    console.log('Tracking information with explicit carrier:');
    console.log(JSON.stringify(trackingInfo, null, 2));
  } catch (error) {
    console.error('Error fetching tracking information with explicit carrier:', error.message);
  }
}

// Get tracking number from command line arguments
const trackingNumber = process.argv[2];

testLogisticsIntegration(trackingNumber);