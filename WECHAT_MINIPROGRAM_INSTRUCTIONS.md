# WeChat Mini-Program Instructions

## Overview

This document provides detailed instructions on how to run and preview the WeChat Mini-Program for the online store.

## Prerequisites

1. **WeChat Developer Tool** - Download and install from [WeChat Official Website](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. **WeChat Account** - Register as a WeChat developer
3. **AppID** - Obtain an AppID for your Mini-Program from the WeChat Official Platform

## Running the Mini-Program

### Step 1: Start the Backend Server

Before running the Mini-Program, you need to start the backend API server:

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the server with file-based database (default)
npm start

# OR start with MySQL database (if configured)
npm run start-mysql
```

The server will start on `http://localhost:3000`.

### Step 2: Open WeChat Developer Tool

1. Launch WeChat Developer Tool
2. If this is your first time, you may need to log in with your WeChat account

### Step 3: Import the Project

1. Click on "Import Project" or "+" to add a new project
2. Fill in the project details:
   - **AppID**: Enter your AppID (or use "Test Account" for development)
   - **Project Name**: Give your project a name (e.g., "Online Store")
   - **Project Directory**: Browse to `c:\02WorkSpace\SourceCode\MimiProgram`
3. Click "Import"

### Step 4: Preview the Application

1. After importing, the project will open in the editor
2. Click the "Preview" button (eye icon) in the toolbar
3. You can either:
   - Scan the QR code with your WeChat app to preview on a mobile device
   - Click "Preview in Browser" to see it in your web browser

### Step 5: Test the Features

The Mini-Program has four main pages:

1. **Login Page**: 
   - Default credentials: username `admin`, password `admin123`
   - You can also register a new account

2. **Home Page**:
   - View featured products
   - Browse product categories
   - Use the search functionality

3. **Cart Page**:
   - View items in your cart
   - Adjust quantities
   - Select items for checkout
   - Proceed to checkout

4. **Orders Page**:
   - View order history
   - Check order status
   - View logistics tracking information

## Backend API Integration

The Mini-Program communicates with the backend API through the [utils/api.js](file:///c%3A/02WorkSpace/SourceCode/MimiProgram/utils/api.js) file. All API calls are configured to use `http://localhost:3000` as the base URL.

Make sure the backend server is running while testing the Mini-Program to ensure all features work correctly.

## Configuration

### AppID Configuration

To configure your AppID:

1. Open `project.config.json` in the project root
2. Update the `appid` field with your actual AppID

### API Base URL

To change the API base URL:

1. Open `utils/api.js`
2. Modify the `BASE_URL` constant:
   ```javascript
   const BASE_URL = 'http://your-server-address:port';
   ```

## Troubleshooting

### Common Issues

1. **"Program not starting"**:
   - Ensure the backend server is running
   - Check that the API base URL in `utils/api.js` is correct
   - Verify that there are no firewall issues blocking the connection

2. **Login fails**:
   - Make sure you're using the correct credentials
   - Default test account: username `admin`, password `admin123`
   - Check that the backend server is properly initialized

3. **Data not loading**:
   - Verify the backend server is running
   - Check the network tab in developer tools for API call errors
   - Ensure the database is properly initialized

### Debugging

1. Use the console in WeChat Developer Tool to check for JavaScript errors
2. Use the Network tab to monitor API requests
3. Check the backend server logs for error messages

## Development Workflow

### Modifying the Code

1. Make changes to the WXML, WXSS, or JS files in the respective page directories
2. Save your changes
3. The preview will automatically update (hot reload)

### Adding New Pages

1. Create a new directory in the `pages` folder
2. Add the required files:
   - `page.js` - Page logic
   - `page.wxml` - Page structure
   - `page.wxss` - Page styles
   - `page.json` - Page configuration
3. Add the page path to the `pages` array in `app.json`

### Testing on Mobile Devices

1. Ensure your mobile device and computer are on the same network
2. Click the "Preview" button in WeChat Developer Tool
3. Scan the QR code with your WeChat app
4. The Mini-Program will open on your mobile device

## Deployment

### Uploading to WeChat Platform

1. In WeChat Developer Tool, click "Upload" (cloud icon)
2. Fill in the version number and project notes
3. Click "Upload"
4. Log in to the [WeChat Official Platform](https://mp.weixin.qq.com/) to submit for review

### Backend Deployment

For production deployment, you'll need to:

1. Deploy the backend API to a cloud server
2. Configure a domain name and SSL certificate
3. Update the API base URL in `utils/api.js`
4. Choose and configure your production database (MySQL recommended)

## Additional Resources

- [WeChat Mini-Program Official Documentation](https://developers.weixin.qq.com/miniprogram/en/dev/framework/)
- [WeChat Developer Tool Guide](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)
- Backend API documentation in [PROJECT_SUMMARY.md](file:///c%3A/02WorkSpace/SourceCode/MimiProgram/PROJECT_SUMMARY.md)