/**
 * Yunda Express API Integration Template
 * 
 * This is a template for integrating with the official Yunda Express API.
 * Once you obtain the official API endpoint and documentation from Yunda Express,
 * you can update this template with the correct values.
 * 
 * Current credentials:
 * APPKEY: 004249
 * APPSECRET: 269912237f12c25d2e15560f5ae47c94
 */

const axios = require('axios');
const crypto = require('crypto');

// TODO: Update with official Yunda Express API endpoint when available
const YUNDA_API_CONFIG = {
  BASE_URL: 'https://api.yundasys.com', // Replace with official endpoint
  TRACKING_ENDPOINT: '/track/query',    // Replace with official endpoint
  VERSION: 'v1',                        // Replace with official version if different
  TIMEOUT: 10000                        // 10 second timeout
};

/**
 * Generate signature for API requests (common pattern in logistics APIs)
 * TODO: Update this function based on Yunda's actual signature requirements
 * 
 * @param {Object} params - Request parameters
 * @param {string} appSecret - Application secret
 * @returns {string} Generated signature
 */
const generateSignature = (params, appSecret) => {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params).sort().reduce((obj, key) => {
    obj[key] = params[key];
    return obj;
  }, {});
  
  // Create query string
  const queryString = Object.keys(sortedParams)
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');
  
  // Append app secret
  const signString = `${queryString}&key=${appSecret}`;
  
  // Generate MD5 hash (common in Chinese logistics APIs)
  return crypto.createHash('md5').update(signString).digest('hex').toUpperCase();
};

/**
 * Get tracking information from Yunda Express
 * 
 * TODO: Update this function with the official API specification
 * 
 * @param {string} trackingNumber - The tracking number to query
 * @returns {Promise<Object>} Tracking information
 */
const getYundaTrackingInfo = async (trackingNumber) => {
  try {
    console.log(`[YUNDA] Fetching tracking info for: ${trackingNumber}`);
    
    // Prepare request parameters
    // TODO: Update with actual required parameters from Yunda API documentation
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const params = {
      tracking_number: trackingNumber,
      appkey: process.env.YUNDA_APP_KEY,
      timestamp: timestamp,
      // Add other required parameters as specified in official documentation
    };
    
    // Generate signature
    // TODO: Update signature generation based on official requirements
    const signature = generateSignature(params, process.env.YUNDA_APP_SECRET);
    params.sign = signature;
    
    // Make API call
    // TODO: Update endpoint and method based on official documentation
    const response = await axios.post(
      `${YUNDA_API_CONFIG.BASE_URL}${YUNDA_API_CONFIG.TRACKING_ENDPOINT}`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers required by Yunda API
        },
        timeout: YUNDA_API_CONFIG.TIMEOUT
      }
    );
    
    console.log(`[YUNDA] API response for ${trackingNumber}:`, response.status);
    
    // Handle API response
    // TODO: Update response handling based on official API format
    if (response.data && response.data.success) {
      return transformApiResponse(response.data, trackingNumber);
    } else {
      throw new Error(response.data?.message || 'Yunda Express API error');
    }
  } catch (error) {
    console.error('[YUNDA] Tracking API error:', error.message);
    
    // Handle different types of errors
    if (error.response) {
      // API responded with error status
      throw new Error(`API Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - unable to reach Yunda Express API');
    } else {
      // Other error
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

/**
 * Transform Yunda Express API response to standard format
 * 
 * TODO: Update this function based on the actual API response format
 * 
 * @param {Object} apiResponse - Raw API response
 * @param {string} trackingNumber - Tracking number
 * @returns {Object} Standardized tracking information
 */
const transformApiResponse = (apiResponse, trackingNumber) => {
  // TODO: Update this transformation based on actual API response structure
  const data = apiResponse.data || {};
  
  return {
    trackingNumber: data.tracking_number || trackingNumber,
    carrier: 'Yunda Express',
    status: data.status || 'Unknown',
    estimatedDelivery: data.estimated_delivery || null,
    events: (data.events || []).map(event => ({
      status: event.status || 'Unknown',
      timestamp: event.timestamp || new Date().toISOString(),
      location: event.location || 'Unknown',
      description: event.description || ''
    }))
  };
};

/**
 * Validate if a tracking number belongs to Yunda Express
 * 
 * @param {string} trackingNumber - The tracking number to validate
 * @returns {boolean} Whether the tracking number is a Yunda number
 */
const isYundaTrackingNumber = (trackingNumber) => {
  if (!trackingNumber) return false;
  
  // Yunda Express tracking numbers are typically 12-15 digits
  const yundaPattern = /^\d{12,15}$/;
  return yundaPattern.test(trackingNumber);
};

module.exports = {
  getYundaTrackingInfo,
  isYundaTrackingNumber,
  // Export config for testing purposes
  YUNDA_API_CONFIG
};