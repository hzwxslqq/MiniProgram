# Yunda Express API Migration Guide

This guide explains how to migrate from the current mock implementation to the official Yunda Express API once you obtain the endpoint information.

## Current Implementation Status

The current implementation in [yunda.js](file://c:\02WorkSpace\SourceCode\MimiProgram\backend\utils\logistics\yunda.js) includes:
- Proper credential handling (APPKEY and APPSECRET)
- Correct tracking number validation
- Fallback mechanism for API errors
- Standardized response format

## Migration Steps

### 1. Update API Endpoint Configuration

Replace the placeholder endpoints in [yunda.js](file://c:\02WorkSpace\SourceCode\MimiProgram\backend\utils\logistics\yunda.js):

```javascript
// Current placeholder values
const YUNDA_API_BASE_URL = 'https://api.yundasys.com';
const YUNDA_API_ENDPOINT = '/track/query';

// Replace with official values (example)
const YUNDA_API_BASE_URL = 'https://openapi.yundasys.com';
const YUNDA_API_ENDPOINT = '/api/v1/track';
```

### 2. Update Authentication Method

The current implementation uses basic parameter authentication. Update based on official requirements:

```javascript
// Current implementation
const response = await axios.get(`${YUNDA_API_BASE_URL}${YUNDA_API_ENDPOINT}`, {
  params: {
    tracking_number: trackingNumber,
    appkey: process.env.YUNDA_APP_KEY,
    appsecret: process.env.YUNDA_APP_SECRET
  }
});

// Example of token-based authentication (update based on official docs)
const response = await axios.get(`${YUNDA_API_BASE_URL}${YUNDA_API_ENDPOINT}`, {
  params: {
    tracking_number: trackingNumber,
    appkey: process.env.YUNDA_APP_KEY
  },
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Update Request Parameters

Modify the request parameters based on official API documentation:

```javascript
// Current parameters
params: {
  tracking_number: trackingNumber,
  appkey: process.env.YUNDA_APP_KEY,
  appsecret: process.env.YUNDA_APP_SECRET
}

// Example of official parameters (update based on docs)
params: {
  tracking_number: trackingNumber,
  app_key: process.env.YUNDA_APP_KEY,
  timestamp: getCurrentTimestamp(),
  sign: generateSignature(params, process.env.YUNDA_APP_SECRET),
  format: 'json',
  v: '1.0'
}
```

### 4. Update Signature Generation

If the official API requires signature generation, update the algorithm:

```javascript
// Current simple signature (example)
const generateSignature = (params, appSecret) => {
  // Implementation based on official documentation
  // Common patterns include MD5, SHA1, or HMAC-SHA256
};
```

### 5. Update Response Handling

Modify the response transformation based on the actual API response format:

```javascript
// Current transformation
const transformApiResponse = (apiResponse, trackingNumber) => {
  // Update based on actual response structure from official API
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
```

## Testing the Migration

### 1. Unit Tests

Use the existing test files to verify the migration:

```bash
# Test the Yunda integration directly
node test-yunda.js

# Test complete order flow
node test-complete-order-flow.js
```

### 2. Integration Tests

Test through the controller endpoints:

```bash
# Start the backend server
npm start

# Use API testing tools like Postman or curl to test:
# GET /api/orders/{orderId}/tracking
```

## Common API Patterns in Logistics Providers

When you receive the official documentation, look for these common patterns:

### Authentication Methods
1. **API Key in Headers**: `Authorization: APIKEY your-api-key`
2. **API Key in Parameters**: `?api_key=your-api-key`
3. **OAuth 2.0**: Token-based authentication
4. **Signature-based**: Hash-based signatures (common in Chinese logistics APIs)

### Request Formats
1. **Query Parameters**: `?tracking_number=123456789`
2. **POST Body**: JSON payload with tracking information
3. **Path Parameters**: `/track/123456789`

### Response Formats
Most logistics APIs return similar information:
- Tracking number
- Current status
- Estimated delivery date
- Event history with timestamps and locations

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Verify APPKEY and APPSECRET values
2. **Rate Limiting**: Check if you're exceeding API call limits
3. **Invalid Tracking Numbers**: Ensure tracking numbers follow Yunda's format
4. **Network Issues**: Verify the API endpoint is accessible

### Debugging Tips
1. Enable detailed logging in the API calls
2. Test with known valid tracking numbers
3. Check the official API documentation for error codes
4. Use tools like Postman to test API calls independently

## Fallback Mechanism

The current implementation includes a fallback to mock data when the API is unavailable. This mechanism should remain in place to ensure your application continues to function even if the API has temporary issues.

## Support

If you encounter issues during the migration:
1. Refer to the official Yunda Express API documentation
2. Contact Yunda Express developer support
3. Check the [README.md](file://c:\02WorkSpace\SourceCode\MimiProgram\backend\utils\logistics\README.md) for additional guidance
4. Review the [YUNDA_INTEGRATION_TEST_SUMMARY.md](file://c:\02WorkSpace\SourceCode\MimiProgram\backend\YUNDA_INTEGRATION_TEST_SUMMARY.md) for test results and expected behavior