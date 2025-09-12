# WeChat Mini-Program Preview Instructions

## Project Structure
This project contains a complete WeChat Mini-Program for an online store with:
1. Frontend (WeChat Mini-Program)
2. Backend API (Node.js with Express)

## Preview Instructions

### Frontend Only Preview (UI/UX)
Since there are some environment setup issues, you can preview the frontend UI by:

1. Open WeChat Developer Tool manually
2. Import the project from: `c:\02WorkSpace\SourceCode\MimiProgram`
3. The project structure includes:
   - Login page
   - Home page with product listings
   - Shopping cart page
   - Orders page

### Backend API
The backend API is ready but requires proper setup:

1. Navigate to the backend directory: `cd c:\02WorkSpace\SourceCode\MimiProgram\backend`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. API will be available at: `http://localhost:3000`

## Features Implemented

### Frontend Features
- User authentication interface
- Product browsing with categories
- Shopping cart management
- Order history and tracking
- Responsive design for all device screens

### Backend Features
- User registration and authentication with JWT
- Product management with search and filtering
- Shopping cart operations
- Order processing
- Payment integration (WeChat Pay)
- Logistics tracking information

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Products
- GET `/api/products` - Get product list
- GET `/api/products/:id` - Get product details
- GET `/api/products/categories` - Get product categories

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:id` - Update cart item
- DELETE `/api/cart/:id` - Remove item from cart

### Orders
- GET `/api/orders` - Get user's orders
- GET `/api/orders/:id` - Get order details
- POST `/api/orders` - Create new order
- POST `/api/orders/:id/payment` - Process payment
- GET `/api/orders/:id/tracking` - Get tracking info

## Next Steps for Full Functionality

1. Install Node.js dependencies in the backend directory
2. Ensure MongoDB is installed and running (or use the file-based database as fallback)
3. Configure environment variables in `backend/.env`
4. Start both frontend and backend services