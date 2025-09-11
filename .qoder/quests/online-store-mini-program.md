# Online Store WeChat Mini-Program Design Document

## 1. Overview

This document outlines the design of an online store WeChat Mini-Program for product sales. The application will include four core pages: login, home, shopping cart, and order list (with payment and logistics information). Customers browse products on the homepage, add items to cart, pay directly from the cart, and view logistics information in the order list. The design focuses on a clean, user-friendly interface that works across various device screens while providing a seamless shopping experience.

### 1.1 Key Features
- User authentication with username/password login
- Product browsing on the home page with add to cart functionality
- Shopping cart with direct payment processing via WeChat Pay
- Order list with logistics information display
- Responsive design for all device screens

### 1.2 Technology Stack
- WeChat Mini-Program Framework
- WeChat Pay API for payment processing
- JavaScript for business logic
- WXML/WXSS for UI rendering

## 2. Architecture

The mini-program follows the standard WeChat Mini-Program architecture with a global app configuration and individual pages.

```
project/
├── app.js                 # Application logic
├── app.json               # Global configuration
├── app.wxss               # Global styles
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

### 2.1 Project Configuration
The `app.json` file configures all pages, window appearance, and navigation. For this online store, we will configure the four required pages and set up appropriate navigation.

## 3. Component Architecture

### 3.1 Global App Structure
The app follows the standard WeChat Mini-Program structure with global files:
- `app.js`: Contains application lifecycle functions and global data
- `app.json`: Configures all pages, window appearance, and tab bar
- `app.wxss`: Defines global styles

### 3.2 Page Components

#### Login Page
- Username input field with validation
- Password input field with validation
- Login button with loading state
- Registration link (optional)
- Error message display

#### Home Page
- Banner/slider for promotions with auto-play
- Product category navigation with icons
- Product listing with images, names, prices, and ratings
- Search functionality with suggestions
- User profile access in header
- Category filtering
- Add to cart functionality directly from product listings
- Quick order placement from product cards

#### Shopping Cart Page
- List of selected products with quantities
- Ability to modify product quantities with +/- buttons
- Remove items from cart with confirmation
- Calculate and display total price with currency formatting
- Pay with WeChat Pay button with disabled state when cart is empty
- Empty cart state with continue shopping option

#### Order List Page
- List of customer orders with status indicators
- Order details view with products, quantities, and prices
- Logistics information section with tracking details
- Order total display
- Payment button for pending orders

## 4. Data Flow

```
graph TD
    A[User] --> B[Login Page]
    B --> C{Authentication}
    C -->|Success| D[Home Page]
    C -->|Failure| B
    D --> E[Browse Products]
    E --> F[Add to Cart]
    F --> G[Shopping Cart Page]
    G --> H[Pay with WeChat Pay]
    H --> I[Order List Page]
    I --> J[View Logistics Info]
```

## 5. API Endpoints Reference

### 5.1 Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/login` | POST | Authenticate user with username/password |
| `/api/register` | POST | Register new user |

### 5.2 Product Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get list of products |
| `/api/products/{id}` | GET | Get specific product details |
| `/api/categories` | GET | Get product categories |

### 5.3 Cart Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cart` | GET | Get user's cart items |
| `/api/cart` | POST | Add item to cart |
| `/api/cart/{id}` | PUT | Update cart item quantity |
| `/api/cart/{id}` | DELETE | Remove item from cart |

### 5.4 Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | POST | Create new order |
| `/api/orders` | GET | Get user's order list |
| `/api/orders/{id}` | GET | Get order details |
| `/api/orders/{id}/payment` | POST | Process payment for order |
| `/api/orders/{id}/tracking` | GET | Get logistics tracking info |

## 6. Data Models

### 6.1 User Model
```javascript
{
  id: string,
  username: string,
  password: string, // hashed
  email: string,
  phone: string,
  avatar: string, // URL to user avatar
  createdAt: date,
  updatedAt: date
}
```

### 6.2 Product Model
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  originalPrice: number, // For discount display
  image: string, // Main product image URL
  images: [string], // Additional product images
  categoryId: string,
  categoryName: string,
  stock: number,
  rating: number, // Average rating
  reviewCount: number, // Number of reviews
  tags: [string], // Product tags for filtering
  isFeatured: boolean, // For homepage featured section
  createdAt: date,
  updatedAt: date
}
```

### 6.3 Category Model
```javascript
{
  id: string,
  name: string,
  icon: string, // Category icon URL
  parentId: string, // For hierarchical categories
  sortOrder: number, // Display order
  createdAt: date,
  updatedAt: date
}
```

### 6.4 Cart Item Model
```javascript
{
  id: string,
  userId: string,
  productId: string,
  productName: string,
  productImage: string,
  price: number,
  quantity: number,
  selected: boolean, // For partial checkout
  createdAt: date,
  updatedAt: date
}
```

### 6.5 Order Model
```javascript
{
  id: string,
  userId: string,
  orderNumber: string, // Human-readable order number
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
  paymentMethod: string, // wechat_pay
  paymentId: string,
  trackingNumber: string, // Logistics tracking number
  estimatedDelivery: date, // Estimated delivery date
  createdAt: date,
  updatedAt: date
}
```

### 6.6 Logistics Tracking Model
```javascript
{
  orderId: string,
  trackingNumber: string,
  carrier: string, // Shipping carrier name
  status: string, // Current status
  estimatedDelivery: date,
  events: [
    {
      timestamp: date,
      location: string,
      description: string,
      status: string
    }
  ]
}
```

## 7. Business Logic Layer

### 7.1 Authentication Flow
1. User enters username and password in login form
2. Frontend validates input format (non-empty, proper email format if using email)
3. Credentials are sent to server via HTTPS POST request
4. Server validates credentials against database
5. On successful authentication, server generates JWT token
6. Token is returned to client and stored in localStorage/cookie
7. All subsequent API requests include the token in Authorization header
8. Token is validated on server for each protected request

### 7.2 Product Browsing
1. Home page loads featured products and categories on initialization
2. Banner images are loaded from CDN for performance
3. Categories are displayed in a horizontal scrollable list
4. User can browse products by category with pagination
5. Search functionality provides real-time suggestions as user types
6. Product listing supports sorting (price, rating, popularity)
7. Product details page shows images, description, reviews, and related products
8. "Add to Cart" functionality directly from product listing or details page
9. Quick order placement from homepage product cards

### 7.3 Shopping Cart Management
1. User adds products to cart from product pages (with quantity selection)
2. Cart state is synchronized with server for logged-in users
3. Cart page displays all selected items with images and details
4. User can modify quantities with real-time total calculation
5. User can remove items with confirmation
6. Cart items persist between sessions using localStorage for guests
7. Cart total includes real-time calculation of taxes and shipping estimates
8. Empty cart state provides options to continue shopping

### 7.4 Order Processing
1. User adds products to cart from homepage
2. User navigates to cart page to review items
3. User initiates payment directly from cart page
4. Order is created on server with "pending" status
5. Payment parameters are generated and returned to client
6. WeChat Pay SDK is initialized with payment parameters
7. User completes payment in WeChat Pay interface
8. Payment result is sent to server for verification
9. On successful payment, order status is updated to "paid"
10. User is redirected to order list page
11. Logistics information is displayed in order list

## 8. Payment Integration

### 8.1 WeChat Pay Flow
```
sequenceDiagram
    participant U as User
    participant M as Mini-Program
    participant S as Server
    participant W as WeChat Pay
    
    U->>M: Click Pay Button
    M->>S: Request Payment (Order Info)
    S->>W: Call Unified Order API
    W-->>S: Payment Parameters
    S-->>M: Return Payment Parameters
    M->>W: Launch WeChat Pay
    W-->>M: Payment Result
    M->>S: Verify Payment
    S-->>M: Order Status Update
    M->>U: Show Order Confirmation
```

### 8.2 WeChat Pay Implementation Details
1. **Payment Parameters Generation**:
   - Server calls WeChat Pay Unified Order API with order details
   - Required parameters: appid, mch_id, nonce_str, sign, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type
   - Server generates signature using API key for security

2. **Client-side Payment Request**:
   - Mini-program uses `wx.requestPayment` API
   - Parameters include: timeStamp, nonceStr, package, signType, paySign
   - All parameters are generated by server to prevent tampering

3. **Payment Notification**:
   - WeChat Pay sends asynchronous notification to server
   - Server verifies notification authenticity using signature
   - Order status is updated in database
   - Notification response must follow WeChat Pay specification

### 8.3 Payment Security
- All payment requests are server-side initiated
- Sensitive payment data (API keys, merchant IDs) never exposed to the client
- Payment verification is performed on the server
- HTTPS encryption for all payment-related communications
- Input validation for all payment parameters
- Idempotency handling to prevent duplicate payments

## 9. Logistics Information Display

The logistics information section will display comprehensive tracking information to keep users informed about their order status:

### 9.1 Tracking Information Display
- Order tracking number with copy functionality
- Current shipping status with visual indicator
- Timeline of shipping events with timestamps and locations
- Estimated delivery date with calendar integration option
- Carrier information with contact details
- Map view showing current location (if available)

### 9.2 Logistics Data Integration
1. **Tracking Data Sources**:
   - Direct integration with major carriers (SF Express, YTO, STO, etc.)
   - Manual tracking updates for smaller carriers
   - Third-party logistics APIs

2. **Real-time Updates**:
   - Scheduled data synchronization (every 2 hours)
   - Manual refresh option for users
   - Push notifications for major status changes
   - Webhook integration for instant updates

3. **Display Components**:
   - Progress bar showing shipment status
   - Interactive timeline with expandable event details
   - Map integration for location visualization
   - Contact carrier button for customer service

### 9.3 Status Definitions
- **Order Placed**: Order confirmed and payment processed
- **Processing**: Order being prepared for shipment
- **Shipped**: Package handed to carrier
- **In Transit**: Package moving through carrier network
- **Out for Delivery**: Package on delivery vehicle
- **Delivered**: Package successfully delivered
- **Exception**: Delivery issue requiring attention

## 10. Responsive Design Strategy

### 10.1 Screen Adaptation
- Flexible layout using rpx units for consistent sizing across devices
- Media queries for different screen sizes (mobile, tablet)
- Adaptive component sizing based on viewport dimensions
- Scrollable sections for content overflow with custom scrollbars
- Orientation change handling for landscape/portrait modes
- Dynamic font sizing based on device pixel ratio

### 10.2 UI Components
- Consistent color scheme with primary, secondary, and accent colors
- Typography hierarchy with appropriate font sizes and weights
- Intuitive navigation patterns following WeChat design guidelines
- Touch-friendly button sizes (minimum 44px tap targets)
- Clear visual hierarchy with proper spacing and contrast
- Loading states for all asynchronous operations
- Empty states for cart, orders, and search results
- Error states with user-friendly messaging

### 10.3 WeChat Design Guidelines Compliance
- Adherence to WeChat Mini-Program design principles
- Use of native components where appropriate
- Consistent interaction patterns with other WeChat features
- Proper use of WeChat-styled UI components
- Accessibility compliance with screen reader support

## 11. Testing Strategy

### 11.1 Unit Testing
- Authentication logic testing (valid/invalid credentials, edge cases)
- Cart calculation accuracy (quantities, pricing, taxes, discounts)
- Order processing validation (order creation, status transitions)
- Payment parameter generation (signature calculation, data formatting)
- Logistics tracking data parsing and display in order list
- Utility function testing (data formatting, validation helpers)

### 11.2 Integration Testing
- API endpoint validation (request/response formats, error handling)
- WeChat Pay integration testing (payment flow, notification handling)
- Data persistence testing (database operations, caching)
- Cross-page navigation testing (state preservation, data flow)
- Third-party service integration (logistics tracking)
- Security testing (authentication, authorization, input validation)

### 11.3 UI Testing
- Responsive layout verification across different device sizes
- Component rendering across devices (iOS, Android, different WeChat versions)
- User interaction flow testing (homepage to cart to payment to order list)
- Accessibility compliance checking (screen readers, contrast ratios)
- Performance testing (load times, memory usage)
- Visual regression testing (UI consistency across updates)

### 11.4 Testing Tools
- WeChat Developer Tool for simulation and debugging
- Jest for unit testing
- Cypress for end-to-end testing
- Postman for API testing
- Browser developer tools for performance analysis

## 12. Project Setup and Deployment

### 12.1 Development Environment Setup
1. Install WeChat Developer Tool from official website
2. Register as a WeChat Mini-Program developer
3. Create a new Mini-Program project in the tool
4. Configure project settings with AppID (obtained from WeChat platform)
5. Set up project directory structure as outlined in section 2

### 12.2 Configuration Files
- `app.json`: Configure pages, window appearance, and network timeout
- `project.config.json`: Development tool configuration
- `sitemap.json`: Pages indexed by WeChat search

### 12.3 Deployment Process
1. Code completion and testing in development environment
2. Upload code to WeChat platform via Developer Tool
3. Submit for review in WeChat Mini-Program Admin Console
4. After approval, release to production environment
5. Monitor performance and user feedback

### 12.4 Backend Requirements
- HTTPS-enabled server for API endpoints
- Database for user, product, and order data
- WeChat Pay merchant account setup
- Logistics tracking API integration
- SSL certificate for secure communications

## 13. Conclusion

This design document provides a comprehensive blueprint for developing an online store WeChat Mini-Program with the four core pages: login, home, shopping cart, and order list. The simplified business flow allows customers to browse products on the homepage, add items to cart, pay directly from the cart, and view logistics information in the order list. The design emphasizes:

1. **User Experience**: Clean, intuitive interface that follows WeChat design guidelines
2. **Functionality**: Streamlined e-commerce flow from product browsing to payment and logistics tracking
3. **Technical Implementation**: Detailed architecture and data models that can be directly implemented
4. **Security**: Robust authentication and payment security measures
5. **Scalability**: Modular design that can be extended with additional features

The mini-program is designed to be directly importable into the WeChat Developer Tool for immediate development and testing. All components follow the standard WeChat Mini-Program structure and can be easily maintained and extended.
