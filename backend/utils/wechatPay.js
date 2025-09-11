// WeChat Pay utility functions
const crypto = require('crypto');

// Generate nonce string
const generateNonceStr = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate timestamp
const generateTimestamp = () => {
  return Math.floor(Date.now() / 1000).toString();
};

// Generate signature for WeChat Pay
const generateSignature = (params, apiKey) => {
  // Sort parameters
  const sortedParams = Object.keys(params).sort().reduce((obj, key) => {
    obj[key] = params[key];
    return obj;
  }, {});
  
  // Create string to sign
  const stringToSign = Object.keys(sortedParams)
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');
  
  // Add API key
  const stringToSignWithKey = `${stringToSign}&key=${apiKey}`;
  
  // Generate MD5 hash
  return crypto.createHash('md5').update(stringToSignWithKey).digest('hex').toUpperCase();
};

// Generate payment parameters for WeChat Pay
const generatePaymentParams = (order, appId, mchId, apiKey) => {
  const nonceStr = generateNonceStr();
  const timestamp = generateTimestamp();
  
  const params = {
    appid: appId,
    mch_id: mchId,
    nonce_str: nonceStr,
    body: `Order Payment - ${order.orderNumber}`,
    out_trade_no: order.orderNumber,
    total_fee: Math.round(order.totalAmount * 100), // Convert to cents
    spbill_create_ip: '127.0.0.1',
    notify_url: 'https://your-domain.com/api/orders/payment-notify',
    trade_type: 'JSAPI'
  };
  
  // Generate signature
  const sign = generateSignature(params, apiKey);
  
  return {
    ...params,
    sign
  };
};

module.exports = {
  generateNonceStr,
  generateTimestamp,
  generateSignature,
  generatePaymentParams
};