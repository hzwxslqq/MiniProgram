# WeChat Cloud Development Guide

## Overview

This guide explains how to set up and use WeChat Cloud Development for the Online Store Mini-Program. Cloud Development provides a serverless solution that integrates directly with WeChat Mini-Programs.

## Prerequisites

1. Register as a WeChat Mini-Program developer
2. Enable Cloud Development in your WeChat Mini-Program
3. Install WeChat DevTools

## Setup Instructions

### 1. Enable Cloud Development

1. Open your project in WeChat DevTools
2. In the toolbar, click on "Cloud Development" button
3. Create a new cloud environment or select an existing one
4. Note down your cloud environment ID

### 2. Update Configuration

1. Update `project.config.json` with your cloud environment ID:
   ```json
   {
     "cloudfunctionRoot": "cloudfunctions/",
     "setting": {
       "cloudfunctionRoot": "cloudfunctions/"
     }
   }
   ```

2. Update `app.js` with your cloud environment ID:
   ```javascript
   if (wx.cloud) {
     wx.cloud.init({
       env: 'your-env-id', // Replace with your cloud environment ID
       traceUser: true
     });
   }
   ```

### 3. Deploy Cloud Functions

1. In WeChat DevTools, right-click on the `cloudfunctions` folder
2. Select "Upload and Deploy All Cloud Functions"
3. Wait for deployment to complete

## Cloud Functions

The following cloud functions are implemented:

### Authentication
- **login**: Handles user login and registration

### Products
- **getProducts**: Retrieves product listings with filtering capabilities

### Cart
- **addToCart**: Adds items to the user's shopping cart

### Orders
- **createOrder**: Creates new orders and clears the shopping cart

## API Usage

The application automatically uses cloud functions when running in the WeChat environment. The API utility (`utils/api.js`) detects the environment and routes requests appropriately:

- **WeChat Environment**: Uses cloud functions
- **Non-WeChat Environment**: Uses HTTP API calls

## Testing Cloud Functions

You can test cloud functions directly in WeChat DevTools:

1. Open the "Cloud Development" panel
2. Go to the "Cloud Functions" tab
3. Select a function and click "Run"
4. Provide test parameters if needed

## Database Collections

The cloud database uses the following collections:

- **users**: User profiles and authentication data
- **products**: Product information
- **cart_items**: Shopping cart items
- **orders**: Order information

## Security Considerations

- Never store sensitive credentials in client-side code
- Use environment variables for credentials in cloud functions
- Implement proper access controls in cloud functions
- Use HTTPS for all communications

## Troubleshooting

### Common Issues

1. **Cloud functions not found**: Make sure you've deployed the cloud functions
2. **Permission errors**: Check that your cloud environment is properly configured
3. **Database access errors**: Verify that your collections exist and have proper permissions

### Debugging Tips

1. Use `console.log` in cloud functions to output debug information
2. Check the cloud function logs in WeChat DevTools
3. Test cloud functions with sample data before integrating with the frontend