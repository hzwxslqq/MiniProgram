/**
 * Logistics Integration Module
 * 
 * This module provides a unified interface for integrating with multiple
 * logistics providers including Yunda Express and others.
 */

const { getYundaTrackingInfo, isYundaTrackingNumber } = require('./yunda');

/**
 * Get tracking information from the appropriate logistics provider
 * @param {string} trackingNumber - The tracking number to query
 * @param {string} carrier - The carrier name (optional, will auto-detect if not provided)
 * @returns {Promise<Object>} Tracking information
 */
const getTrackingInfo = async (trackingNumber, carrier = null) => {
  try {
    // If carrier is specified, use that provider
    if (carrier) {
      switch (carrier.toLowerCase()) {
        case 'yunda':
        case 'yunda express':
        case '韵达':
        case '韵达快递':
          return await getYundaTrackingInfo(trackingNumber);
        default:
          throw new Error(`Unsupported carrier: ${carrier}`);
      }
    }
    
    // Auto-detect carrier based on tracking number format
    if (isYundaTrackingNumber(trackingNumber)) {
      console.log(`[LOGISTICS] Auto-detected Yunda Express for tracking number: ${trackingNumber}`);
      return await getYundaTrackingInfo(trackingNumber);
    }
    
    // If no carrier detected, throw an error
    throw new Error(`Unable to determine carrier for tracking number: ${trackingNumber}`);
  } catch (error) {
    console.error('[LOGISTICS] Error getting tracking info:', error.message);
    throw error;
  }
};

/**
 * Validate tracking number format
 * @param {string} trackingNumber - The tracking number to validate
 * @returns {Object} Validation result with carrier information
 */
const validateTrackingNumber = (trackingNumber) => {
  const result = {
    isValid: false,
    carrier: null,
    trackingNumber: trackingNumber
  };
  
  if (isYundaTrackingNumber(trackingNumber)) {
    result.isValid = true;
    result.carrier = 'Yunda Express';
  }
  
  return result;
};

module.exports = {
  getTrackingInfo,
  validateTrackingNumber
};