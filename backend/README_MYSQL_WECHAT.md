# Online Store Backend - MySQL and WeChat Cloud Development Guide

## Database Options

This backend supports three database implementations:

1. **File-based database** (default) - For development and testing
2. **MySQL database** - For production use
3. **WeChat Cloud Development** - For WeChat Mini-Program integration

## Using MySQL Database

### Prerequisites

1. Install MySQL server (version 5.7 or higher)
2. Create a MySQL database named `online_store`
3. Update the database configuration in the `.env` file

### Configuration

Update the `.env` file with your MySQL configuration:

```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=online_store
```

### Initialize Database

Run the following command to create tables and seed initial data:

```bash
npm run init-mysql-db
```

### Start Server

Start the server with MySQL database:

```bash
npm start
```

## Using WeChat Cloud Development

WeChat Cloud Development provides a serverless solution that integrates directly with WeChat Mini-Programs.

### Prerequisites

1. Register as a WeChat Mini-Program developer
2. Enable Cloud Development in your WeChat Mini-Program
3. Install WeChat DevTools

### Implementation Steps

1. **Update project configuration**:
   - In `project.config.json`, enable cloud development
   - Set up cloud environment ID

2. **Create cloud functions**:
   - Create cloud functions for each API endpoint
   - Move business logic from Express controllers to cloud functions

3. **Use cloud database**:
   - Replace MySQL/file database with WeChat Cloud Database
   - Update data models to use cloud database syntax

4. **Update API calls**:
   - Replace HTTP API calls with cloud function calls
   - Update frontend to use `wx.cloud` API

### Example Cloud Function Structure

```
cloudfunctions/
├── login/
│   ├── index.js
│   └── package.json
├── getProducts/
│   ├── index.js
│   └── package.json
├── addToCart/
│   ├── index.js
│   └── package.json
└── createOrder/
    ├── index.js
    └── package.json
```

### Example Cloud Function (login)

```javascript
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // Check if user exists
  const userResult = await db.collection('users').where({
    openid: wxContext.OPENID
  }).get()
  
  if (userResult.data.length > 0) {
    // User exists, return user info
    return {
      success: true,
      user: userResult.data[0]
    }
  } else {
    // Create new user
    const newUser = {
      openid: wxContext.OPENID,
      nickname: event.nickname,
      avatarUrl: event.avatarUrl,
      createdAt: new Date()
    }
    
    const createResult = await db.collection('users').add({
      data: newUser
    })
    
    return {
      success: true,
      user: {
        _id: createResult._id,
        ...newUser
      }
    }
  }
}
```

### Example Frontend Integration

```javascript
// In your Mini-Program pages
wx.cloud.callFunction({
  name: 'login',
  data: {
    nickname: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg'
  },
  success: res => {
    console.log('Login success', res.result)
  },
  fail: err => {
    console.error('Login failed', err)
  }
})
```

## Switching Between Database Implementations

To switch between database implementations:

1. Update the `DB_TYPE` environment variable in `.env`:
   - `DB_TYPE=file` for file-based database
   - `DB_TYPE=mysql` for MySQL database
   - `DB_TYPE=wechat` for WeChat Cloud Development (when implemented)

2. Restart the server

## Project Structure with Multiple Database Support

```
backend/
├── config/
│   └── dbConfig.js              # Database configuration
├── controllers/
│   ├── authController.js        # File-based controllers
│   ├── productsController.js
│   ├── cartController.js
│   ├── ordersController.js
│   └── mysql/                   # MySQL controllers
│       ├── authController.js
│       ├── productsController.js
│       ├── cartController.js
│       └── ordersController.js
├── models/
│   ├── User.js                  # File-based models
│   ├── Product.js
│   ├── CartItem.js
│   ├── Order.js
│   └── mysql/                   # MySQL models
│       ├── User.js
│       ├── Product.js
│       ├── CartItem.js
│       └── Order.js
├── routes/
│   ├── auth.js                  # File-based routes
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   └── mysql/                   # MySQL routes
│       ├── auth.js
│       ├── products.js
│       ├── cart.js
│       └── orders.js
├── utils/
│   ├── db.js                   # File-based database utilities
│   ├── mysql.js                # MySQL database utilities
│   └── wechatPay.js
├── middleware/
│   └── auth.js
├── scripts/
│   ├── initDB.js
│   └── initMySQLDB.js
├── server.js                   # Main server file
├── server-mysql.js             # MySQL server file (alternative)
└── .env                        # Environment configuration
```

## Running the Application

### For Development with File-based Database (Default)

```bash
# Install dependencies
npm install

# Start server
npm start
```

### For Production with MySQL Database

```bash
# Install dependencies
npm install

# Update .env with MySQL configuration
# DB_TYPE=mysql

# Initialize database
npm run init-mysql-db

# Start server
npm start
```

### For WeChat Cloud Development

1. Open project in WeChat DevTools
2. Enable Cloud Development
3. Deploy cloud functions
4. Use cloud database instead of local database

## API Endpoints

All endpoints are the same regardless of database implementation:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get product categories

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create a new order
- `POST /api/orders/:id/payment` - Process payment for order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/tracking` - Get logistics tracking info

## WeChat Pay Integration

The application includes WeChat Pay integration for processing payments. By default, the payment processing is in simulation mode for development purposes.

### Enabling Real WeChat Pay Integration

1. Update the `.env` file with your real WeChat Pay credentials:
   ```env
   WECHAT_APP_ID=your-real-wechat-app-id
   WECHAT_APP_SECRET=your-real-wechat-app-secret
   WECHAT_PAY_MCH_ID=your-real-merchant-id
   WECHAT_PAY_API_KEY=your-real-api-key
   ```

2. Uncomment and implement the real WeChat Pay API integration in `backend/controllers/orderController.js` in the `sendWeChatPayRequest` function.

3. Install required dependencies:
   ```bash
   npm install xmlbuilder xml2js
   ```

### Payment Flow

1. User accepts terms and clicks "Pay Now"
2. Frontend sends payment request to backend
3. Backend validates order and generates payment parameters
4. Backend sends request to WeChat Pay API (or simulates in development)
5. If successful, order status is updated to "paid"
6. User is redirected to orders page

### Security Considerations

- Never store sensitive credentials in client-side code
- Use environment variables for credentials
- Implement proper signature verification for WeChat Pay responses
- Use HTTPS for all payment-related communications

## Environment Variables

```env
PORT=3000
DB_TYPE=file|mysql|wechat
MONGODB_URI=mongodb://localhost:27017/online-store
JWT_SECRET=your-jwt-secret
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
WECHAT_PAY_MCH_ID=your-merchant-id
WECHAT_PAY_API_KEY=your-api-key

# MySQL Configuration (required if DB_TYPE=mysql)
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=online_store
```

## Why MySQL Instead of MongoDB?

1. **Cost**: MySQL is completely free and open-source, while MongoDB requires payment for production use
2. **Simplicity**: MySQL has a simpler setup and configuration process
3. **Relational Data**: Our e-commerce data has clear relationships that work well with relational databases
4. **Maturity**: MySQL has been around longer and has more extensive documentation and community support
5. **WeChat Integration**: MySQL integrates well with most cloud hosting providers that support WeChat Mini-Programs

## Testing Payment Flow

### In Development Mode (Simulation)

1. The payment button will show "Processing..." when clicked
2. The backend will simulate a successful payment response
3. The order status will be updated to "paid"
4. User will be redirected to the orders page
5. A modal will appear indicating this is simulation mode

### Testing Real Payment Integration

1. Update `.env` with real WeChat Pay credentials
2. Uncomment the real API implementation
3. Test with WeChat's sandbox environment before going to production
4. Use WeChat DevTools to test the payment flow

## Future Enhancements

1. Add Redis caching for better performance
2. Implement database connection pooling for MySQL
3. Add database migration scripts
4. Implement database backup and restore functionality
5. Add support for other databases (PostgreSQL, etc.)