# Online Store Backend API

This is the backend API for the online store WeChat Mini-Program. It's built with Node.js and Express, providing RESTful endpoints for authentication, product management, cart operations, and order processing.

## Features

- User authentication (registration and login)
- Product browsing and search
- Shopping cart management
- Order processing with payment integration
- Logistics tracking information

## Technologies Used

- Node.js
- Express.js
- MongoDB (simulated with in-memory storage for demo)
- JSON Web Tokens (JWT) for authentication
- bcrypt.js for password hashing
- WeChat Pay integration utilities

## Project Structure

```
backend/
├── controllers/           # Request handlers
├── middleware/            # Custom middleware
├── models/                # Data models
├── routes/                # API routes
├── utils/                 # Utility functions
├── server.js             # Main server file
├── package.json          # Project dependencies
└── .env                  # Environment variables
```

## API Endpoints

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
- `GET /api/orders/:id/tracking` - Get logistics tracking info

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` file

3. Initialize the database (optional):
   ```bash
   npm run init-db
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
JWT_SECRET=your-jwt-secret
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
WECHAT_PAY_MCH_ID=your-merchant-id
WECHAT_PAY_API_KEY=your-api-key
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### User
```javascript
{
  id: string,
  username: string,
  password: string, // hashed
  email: string,
  phone: string,
  avatar: string,
  createdAt: date,
  updatedAt: date
}
```

### Product
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  originalPrice: number,
  image: string,
  images: [string],
  categoryId: string,
  categoryName: string,
  stock: number,
  rating: number,
  reviewCount: number,
  tags: [string],
  isFeatured: boolean,
  createdAt: date,
  updatedAt: date
}
```

### Cart Item
```javascript
{
  id: string,
  userId: string,
  productId: string,
  productName: string,
  productImage: string,
  price: number,
  quantity: number,
  selected: boolean,
  createdAt: date,
  updatedAt: date
}
```

### Order
```javascript
{
  id: string,
  userId: string,
  orderNumber: string,
  items: [
    {
      productId: string,
      productName: string,
      productImage: string,
      quantity: number,
      price: number
    }
  ],
  subtotal: number,
  shippingFee: number,
  totalAmount: number,
  status: string, // pending, paid, shipped, delivered, cancelled
  shippingAddress: {
    name: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string
  },
  paymentMethod: string,
  paymentId: string,
  trackingNumber: string,
  estimatedDelivery: date,
  createdAt: date,
  updatedAt: date
}
```

## Development

This backend is designed to work with the WeChat Mini-Program frontend. For development:

1. Start the backend server
2. Update the API URL in the frontend if needed
3. Test the API endpoints using tools like Postman or curl

## WeChat Pay Integration

The backend includes utilities for WeChat Pay integration. The payment flow:

1. Frontend requests payment parameters
2. Backend generates payment parameters using WeChat Pay API
3. Frontend initiates payment using WeChat Pay SDK
4. WeChat Pay processes the payment
5. WeChat Pay sends notification to backend
6. Backend updates order status