# Logistics Integration

This module provides integration with multiple logistics providers, currently supporting Yunda Express (韵达快递).

## Current Implementation

The current implementation includes:

1. **Yunda Express Integration** - Simulated API integration with fallback mechanism
2. **Unified Interface** - Single interface to handle multiple carriers
3. **Auto-detection** - Automatically detects carrier based on tracking number format

## Official API Integration

For production use, please see:
- [Yunda Express API Template](yunda-api-template.js) - Template for official API integration
- [Migration Guide](MIGRATION_GUIDE.md) - Instructions for updating to official API

## Setting up Real Yunda Express API Integration

To integrate with the real Yunda Express API, you need to:

### 1. Register for API Access

1. Visit the Yunda Express official website
2. Navigate to the API/Developer section
3. Register for API access and obtain your credentials:
   - API Key
   - API Secret
   - Customer ID (if required)

### 2. Update Environment Variables

Your Yunda Express API credentials have been added to your `.env` file:

```env
YUNDA_APP_KEY=004249
YUNDA_APP_SECRET=269912237f12c25d2e15560f5ae47c94
```

These credentials are already configured and will be used when making API calls to Yunda Express.

### 3. Configure Real Yunda Express API Endpoint

The current implementation uses a placeholder endpoint. To use the real Yunda Express API:

1. Obtain the correct API endpoint URL from Yunda Express documentation
2. Update the `YUNDA_API_BASE_URL` and `YUNDA_API_ENDPOINT` constants in `yunda.js`
3. Adjust the authentication parameters based on Yunda's API requirements

```javascript
// Example of how to configure the real API (update with actual values):
const YUNDA_API_BASE_URL = 'https://real-yunda-api-endpoint.com';  // Replace with actual endpoint
const YUNDA_API_ENDPOINT = '/api/v1/tracking';  // Replace with actual endpoint

const getYundaTrackingInfo = async (trackingNumber) => {
  try {
    const response = await axios.get(`${YUNDA_API_BASE_URL}${YUNDA_API_ENDPOINT}`, {
      params: {
        tracking_number: trackingNumber,
        appkey: process.env.YUNDA_APP_KEY,
        appsecret: process.env.YUNDA_APP_SECRET
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Transform the response based on the actual API format
    return transformYundaResponse(response.data, trackingNumber);
  } catch (error) {
    console.error('[YUNDA] Tracking API error:', error.message);
    throw new Error('Failed to fetch tracking information from Yunda Express');
  }
};
```

### 4. Update Tracking Number Validation

Yunda Express tracking numbers typically:
- Are 12-15 digits long
- Contain only numeric characters
- May have specific prefixes

Update the validation pattern in `isYundaTrackingNumber` function if needed.

## API Response Format

The logistics module returns tracking information in a standardized format:

```json
{
  "trackingNumber": "123456789012",
  "carrier": "Yunda Express",
  "status": "In Transit",
  "estimatedDelivery": "2025-09-19",
  "events": [
    {
      "status": "Order Placed",
      "timestamp": "2025-09-14T07:03:20.938Z",
      "location": "Shanghai Sorting Center",
      "description": "Order has been received and is being processed"
    }
  ]
}
```

## Adding More Carriers

To add support for additional logistics providers:

1. Create a new file in the logistics directory (e.g., `sfexpress.js`)
2. Implement the `getCarrierTrackingInfo` and `isCarrierTrackingNumber` functions
3. Update the `index.js` file to include the new carrier
4. Add the carrier to the auto-detection logic

## Testing

Run the test script to verify the integration:

```bash
node test-logistics.js
```