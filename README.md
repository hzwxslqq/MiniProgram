# Online Store WeChat Mini-Program

This is a WeChat Mini-Program for an online store that allows users to browse products, add items to cart, and process orders with payment and logistics tracking.

## Features

- User authentication (login)
- Product browsing on home page
- Shopping cart management
- Order processing with payment
- Logistics tracking information

## Project Structure

```
project/
├── app.js                 # Application logic
├── app.json               # Global configuration
├── app.wxss               # Global styles
├── project.config.json    # Project configuration
├── sitemap.json           # Sitemap configuration
├── pages/
│   ├── login/             # Login page
│   │   ├── login.js       # Login page logic
│   │   ├── login.wxml     # Login page structure
│   │   ├── login.wxss     # Login page styles
│   │   └── login.json     # Login page configuration
│   ├── home/              # Home page
│   │   ├── home.js        # Home page logic
│   │   ├── home.wxml      # Home page structure
│   │   ├── home.wxss      # Home page styles
│   │   └── home.json      # Home page configuration
│   ├── cart/              # Shopping cart page
│   │   ├── cart.js        # Cart page logic
│   │   ├── cart.wxml      # Cart page structure
│   │   ├── cart.wxss      # Cart page styles
│   │   └── cart.json      # Cart page configuration
│   └── orders/            # Order list page
│       ├── orders.js      # Order page logic
│       ├── orders.wxml    # Order page structure
│       ├── orders.wxss    # Order page styles
│       └── orders.json    # Order page configuration
└── utils/                 # Utility functions
    └── api.js             # API request utilities
```

## Pages

### Login Page
- Username/password authentication
- Form validation
- Error handling

### Home Page
- Banner slider for promotions
- Product categories
- Featured products listing
- Search functionality

### Shopping Cart Page
- Cart item listing
- Quantity adjustment
- Item selection
- Total price calculation
- Checkout functionality

### Orders Page
- Order history listing
- Order status tracking
- Payment processing
- Logistics information

## Development

To run this project:

1. Open WeChat Developer Tool
2. Import this project
3. Configure your AppID in `project.config.json`
4. Run and debug the project

## API Integration

The application is designed to work with a backend API. The [utils/api.js](file:///c%3A/02WorkSpace/SourceCode/MimiProgram/utils/api.js) file contains all the API integration utilities.

## Technologies Used

- WeChat Mini-Program Framework
- JavaScript
- WXML (WeiXin Markup Language)
- WXSS (WeiXin Style Sheets)