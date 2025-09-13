# Online Store WeChat Mini-Program

This is a WeChat Mini-Program for an online store that allows users to browse products, add items to cart, and process orders with payment and logistics tracking. It includes both the frontend Mini-Program and a Node.js backend API.

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
├── utils/                 # Utility functions
│   └── api.js             # API request utilities
└── backend/               # Backend API
    ├── controllers/       # Request handlers
    ├── middleware/        # Custom middleware
    ├── models/            # Data models
    ├── routes/            # API routes
    ├── utils/             # Utility functions
    ├── config/            # Configuration files
    ├── scripts/           # Utility scripts
    ├── server.js          # Main server file
    ├── package.json       # Project dependencies
    └── .env               # Environment variables
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

### Frontend (WeChat Mini-Program)

1. Open WeChat Developer Tool
2. Import this project
3. Configure your AppID in `project.config.json`
4. Run and debug the project

### Backend (Node.js API)

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Choose your database implementation (see Database section below)
5. Initialize database with sample data: `npm run init-db` or `npm run init-mysql-db`
6. Start the development server: `npm run dev` or `npm start`
7. The API will be available at `http://localhost:3000`

### Database

The backend supports multiple database implementations:

1. **File-based database** (default) - For development and testing
2. **MySQL database** - For production use (free and open-source)
3. **WeChat Cloud Development** - For WeChat Mini-Program integration

To switch between database implementations, update the `DB_TYPE` environment variable in the `.env` file:
- `DB_TYPE=file` for file-based database (default)
- `DB_TYPE=mysql` for MySQL database
- `DB_TYPE=wechat` for WeChat Cloud Development (when implemented)

For detailed instructions on using MySQL or implementing WeChat Cloud Development, see [backend/README_MYSQL_WECHAT.md](file:///c%3A/02WorkSpace/SourceCode/MimiProgram/backend/README_MYSQL_WECHAT.md).

## API Integration

The application is designed to work with a backend API. The [utils/api.js](file:///c%3A/02WorkSpace/SourceCode/MimiProgram/utils/api.js) file contains all the API integration utilities.

## Technologies Used

- WeChat Mini-Program Framework
- JavaScript
- WXML (WeiXin Markup Language)
- WXSS (WeiXin Style Sheets)
- Node.js
- Express.js
- MySQL (or file-based database as fallback)
- JSON Web Tokens (JWT) for authentication
- bcrypt.js for password hashing