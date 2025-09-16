# Running the Project

## Overview

This document provides detailed instructions for running the Online Store WeChat Mini-Program project, which consists of a frontend WeChat Mini-Program and a backend Node.js API server.

## System Requirements

### For Backend Development
- Node.js (version 12 or higher)
- npm (Node Package Manager)
- MySQL (optional, for production database)
- Git (for version control)

### For Frontend Development
- WeChat Developer Tool
- WeChat Account (for testing)

## Backend Setup

### 1. Install Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following configuration:

```env
# Server configuration
PORT=3000
JWT_SECRET=your-jwt-secret-here

# Database configuration
DB_TYPE=file
# For MySQL, use: DB_TYPE=mysql

# MySQL configuration (only needed if DB_TYPE=mysql)
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=online_store

# WeChat configuration (optional)
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
WECHAT_PAY_MCH_ID=your-merchant-id
WECHAT_PAY_API_KEY=your-api-key
```

### 3. Initialize Database

Choose one of the following database initialization options:

#### For File-based Database (Development)
```bash
npm run init-db
```

#### For MySQL Database (Production)
```bash
npm run init-mysql-db
```

### 4. Start the Server

#### Default Server (uses DB_TYPE from .env)
```bash
npm start
```

#### Development Mode with Auto-reload
```bash
npm run dev
```

#### MySQL-specific Server
```bash
npm run start-mysql
```

## Frontend Setup

### 1. Open in WeChat Developer Tool

1. Open WeChat Developer Tool
2. Select "Import Project"
3. Choose the project root directory
4. Enter your AppID (or use test AppID for development)

### 2. Configure Project

Ensure the `project.config.json` file contains the correct configuration:

```json
{
  "appid": "your-app-id",
  "projectname": "online-store",
  "description": "Online Store WeChat Mini-Program"
}
```

### 3. Run and Debug

1. Click the "Compile" button in WeChat Developer Tool
2. Use the simulator to test the application
3. Debug any issues in the console

## Database Options

The backend supports three database implementations:

### File-based Database (Default)
- Used for development and testing
- No additional setup required
- Data stored in local JSON files

### MySQL Database
- Recommended for production use
- Requires MySQL server installation
- Better performance and data persistence

### WeChat Cloud Development
- Serverless solution integrated with WeChat
- Requires WeChat Cloud Development setup
- Best for full WeChat ecosystem integration

To switch between database implementations, update the `DB_TYPE` environment variable in the `.env` file:
- `DB_TYPE=file` for file-based database
- `DB_TYPE=mysql` for MySQL database
- `DB_TYPE=wechat` for WeChat Cloud Development (when implemented)

## API Integration

The frontend communicates with the backend through RESTful API endpoints:

- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`

Ensure the backend server is running before testing frontend functionality.

## Testing the Application

### Backend Testing
1. Start the server: `npm start`
2. Test API endpoints using tools like Postman or curl
3. Example:
   ```bash
   curl http://localhost:3000/api/products
   ```

### Frontend Testing
1. Open in WeChat Developer Tool
2. Use the built-in simulator
3. Test all pages and functionality
4. Check console for errors

## Common Issues and Solutions

### Port Conflicts
If port 3000 is already in use, change the PORT variable in `.env`:
```env
PORT=3001
```

### Database Connection Issues
1. Verify MySQL server is running
2. Check MySQL credentials in `.env`
3. Ensure the database `online_store` exists

### Missing Dependencies
If you encounter module not found errors:
```bash
npm install
```

## Development Workflow

1. Start backend server: `npm run dev`
2. Open frontend in WeChat Developer Tool
3. Make code changes
4. Observe changes in real-time
5. Debug as needed