# Project Restart Guide

## Overview

This document provides instructions for restarting the Online Store WeChat Mini-Program project. The project consists of a frontend WeChat Mini-Program and a backend Node.js API with support for multiple database implementations.

## Architecture

The project follows a client-server architecture:
- **Frontend**: WeChat Mini-Program with pages for login, home, cart, and orders
- **Backend**: Node.js/Express API with controllers, models, and routes
- **Database**: Supports file-based (default), MySQL, and WeChat Cloud Development implementations

## Prerequisites

Before restarting the project, ensure you have:
1. Node.js installed (version 12 or higher)
2. WeChat Developer Tool installed for frontend development
3. MySQL server installed (if using MySQL database)
4. Internet connection for API dependencies

## Restart Process

### 1. Backend Server Restart

#### Option A: Using File-based Database (Development)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

#### Option B: Using MySQL Database (Production)

1. Ensure MySQL server is running and accessible

2. Update the `.env` file with your MySQL configuration:
   ```env
   DB_TYPE=mysql
   MYSQL_HOST=localhost
   MYSQL_USER=your_mysql_username
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=online_store
   ```

3. Navigate to the backend directory:
   ```bash
   cd backend
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Initialize the database:
   ```bash
   npm run init-mysql-db
   ```

6. Start the server:
   ```bash
   npm start
   ```

#### Option C: Quick MySQL Setup

Use the provided script to automatically configure and start with MySQL:
```bash
cd backend
node start-mysql.js
```

### 2. Frontend Application Restart

1. Open WeChat Developer Tool

2. Import the project by selecting the project root directory

3. Configure your AppID in `project.config.json` (use test AppID for development)

4. Run and debug the project within WeChat Developer Tool

## Environment Configuration

The application behavior is controlled by environment variables in the `.env` file:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| DB_TYPE | Database type (file/mysql/wechat) | file |
| JWT_SECRET | Secret for JWT token generation | online-store-secret-key |

Additional variables exist for WeChat integration and MySQL configuration.

## Database Options

### File-based Database (Default)
- No external dependencies
- Data stored in JSON files in the `backend/data` directory
- Suitable for development and testing

### MySQL Database
- Requires MySQL server installation
- Better performance for production use
- Data persistence and reliability

### WeChat Cloud Development
- Serverless solution integrated with WeChat ecosystem
- Requires WeChat developer account and cloud setup

## API Endpoints

After starting the backend server, the following endpoints will be available at `http://localhost:3000`:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT variable in `.env` file
2. **Database connection failed**: Verify database credentials in `.env`
3. **Dependencies not found**: Run `npm install` in the backend directory
4. **Frontend not connecting to backend**: Check API base URL in `utils/api.js`

### Logs and Monitoring

The server outputs logs to the console including:
- Server startup confirmation
- Database initialization status
- API request handling
- Error messages

## Testing

After restart, verify the system is working correctly:

1. Backend:
   - Visit `http://localhost:3000` to confirm server is running
   - Check console output for database initialization messages

2. Frontend:
   - Open the Mini-Program in WeChat Developer Tool
   - Navigate through pages to ensure they load correctly
   - Test login functionality with default test user

## Maintenance

### Data Management

- File-based database: Data stored in `backend/data` directory
- MySQL database: Use standard MySQL tools for backup/restore
- Regular backups recommended for production environments

### Updates

To update the application:
1. Pull the latest code from repository
2. Run `npm install` in backend directory to update dependencies
3. Restart both frontend and backend services
