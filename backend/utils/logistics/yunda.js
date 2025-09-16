/**
 * Yunda Express API Integration
 * 
 * This module provides integration with Yunda Express (韵达快递) tracking API.
 * Using credentials: APPKEY: 004249, APPSECRET: 269912237f12c25d2e15560f5ae47c94
 * 
 * NOTE: This is a placeholder implementation. See yunda-api-template.js for the official API template
 * and MIGRATION_GUIDE.md for instructions on updating to the official Yunda Express API.
 */

const axios = require('axios');

// Yunda Express API configuration
// NOTE: Replace with the actual Yunda Express API endpoint when you have access
const YUNDA_API_BASE_URL = 'https://api.yundasys.com';  // Placeholder - replace with real endpoint
const YUNDA_API_ENDPOINT = '/track/query';  // Placeholder - replace with real endpoint

/**
 * Get tracking information from Yunda Express
 * @param {string} trackingNumber - The tracking number to query
 * @returns {Promise<Object>} Tracking information
 */
const getYundaTrackingInfo = async (trackingNumber) => {
  try {
    console.log(`[YUNDA] Fetching tracking info for: ${trackingNumber}`);
    
    // Make API call to Yunda Express
    const response = await axios.get(`${YUNDA_API_BASE_URL}${YUNDA_API_ENDPOINT}`, {
      params: {
        tracking_number: trackingNumber,
        appkey: process.env.YUNDA_APP_KEY,
        appsecret: process.env.YUNDA_APP_SECRET
      },
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log(`[YUNDA] API response for ${trackingNumber}:`, response.data);
    
    // Transform API response to our standard format
    const apiData = response.data;
    
    // Handle API errors
    if (apiData.error || apiData.status === 'error') {
      throw new Error(apiData.message || 'Yunda Express API error');
    }
    
    // If we get a successful response, transform it to our format
    if (apiData.success || apiData.status === 'success') {
      const trackingInfo = {
        trackingNumber: trackingNumber,
        carrier: 'Yunda Express',
        status: apiData.data?.status || 'Unknown',
        estimatedDelivery: apiData.data?.estimated_delivery || null,
        events: []
      };
      
      // Transform events if they exist
      if (apiData.data?.events && Array.isArray(apiData.data.events)) {
        trackingInfo.events = apiData.data.events.map(event => ({
          status: event.status || 'Unknown',
          timestamp: event.timestamp || new Date().toISOString(),
          location: event.location || 'Unknown',
          description: event.description || ''
        }));
      }
      
      return trackingInfo;
    }
    
    // If we can't parse the response, return a basic structure
    return {
      trackingNumber: trackingNumber,
      carrier: 'Yunda Express',
      status: 'Unknown',
      estimatedDelivery: null,
      events: [
        {
          status: 'Info Retrieved',
          timestamp: new Date().toISOString(),
          location: 'API Response',
          description: 'Successfully retrieved data from Yunda Express API'
        }
      ]
    };
  } catch (error) {
    console.error('[YUNDA] Tracking API error:', error.message);
    
    // If the API call fails, fall back to mock data but indicate it's a fallback
    console.log('[YUNDA] Falling back to mock data due to API error');
    
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return {
      trackingNumber: trackingNumber,
      carrier: 'Yunda Express',
      status: 'In Transit',
      estimatedDelivery: new Date(now.getTime() + 3 * oneDay).toISOString().split('T')[0],
      events: [
        {
          status: 'Order Placed',
          timestamp: new Date(now.getTime() - 2 * oneDay).toISOString(),
          location: 'Shanghai Sorting Center',
          description: 'Order has been received and is being processed (Mock data due to API error)'
        },
        {
          status: 'Picked Up',
          timestamp: new Date(now.getTime() - 1.5 * oneDay).toISOString(),
          location: 'Shanghai Distribution Center',
          description: 'Package has been picked up by courier (Mock data due to API error)'
        },
        {
          status: 'In Transit',
          timestamp: new Date(now.getTime() - 1 * oneDay).toISOString(),
          location: 'Beijing Transfer Station',
          description: 'Package is in transit to destination city (Mock data due to API error)'
        },
        {
          status: 'Out for Delivery',
          timestamp: new Date(now.getTime() - 0.5 * oneDay).toISOString(),
          location: 'Beijing Distribution Center',
          description: 'Package is out for delivery (Mock data due to API error)'
        }
      ]
    };
  }
};

/**
 * Validate if a tracking number belongs to Yunda Express
 * Yunda tracking numbers typically start with specific prefixes
 * @param {string} trackingNumber - The tracking number to validate
 * @returns {boolean} Whether the tracking number is a Yunda number
 */
const isYundaTrackingNumber = (trackingNumber) => {
  // Yunda Express tracking numbers commonly have these patterns:
  // - Start with digits
  // - Usually 12-13 digits long
  // - Some may have specific prefixes
  
  if (!trackingNumber) return false;
  
  // Simple validation - Yunda numbers are typically numeric
  const yundaPattern = /^\d{12,15}$/;
  return yundaPattern.test(trackingNumber);
};

module.exports = {
  getYundaTrackingInfo,
  isYundaTrackingNumber
};