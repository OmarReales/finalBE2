# Node.js RESTful API with MVC Architecture

A complete RESTful API built with Node.js and Express.js following the Model-View-Controller (MVC) design pattern with a layered architecture.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Examples](#examples)
- [License](#license)

## Project Overview

This project is a robust RESTful API that implements a complete e-commerce backend system, providing functionalities for user authentication, product management, shopping cart operations, and order processing through tickets. The application follows best practices in software architecture, implementing:

- MVC pattern
- Repository pattern
- DTO pattern
- Layered architecture
- Authentication with JWT and Passport
- Error handling middleware
- Advanced logging

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **MongoDB** with Mongoose (v8.14.1) - Database and ODM
- **Passport.js** (v0.7.0) - Authentication middleware
- **JWT** (jsonwebtoken v9.0.2) - Token-based authentication
- **bcrypt** (v5.1.1) - Password hashing
- **Winston** (v3.17.0) - Logging
- **cors** (v2.8.5) - Cross-Origin Resource Sharing
- **dotenv** (v16.5.0) - Environment variable management
- **express-session** (v1.18.1) - Session management
- **cookie-parser** (v1.4.7) - Cookie parsing
- **mongoose-paginate-v2** (v1.9.0) - Pagination utility

## Architecture

The application follows a layered architecture:

```
src/
├── app.js             # Express app setup
├── server.js          # Server entry point
├── config/            # Application configuration
├── controllers/       # Request handlers
├── dao/               # Data Access Objects
│   ├── models/        # MongoDB schemas
│   └── mongo/         # MongoDB implementations
├── dto/               # Data Transfer Objects
├── middlewares/       # Express middlewares
├── passport/          # Passport.js strategies
├── repositories/      # Repository layer
├── requests/          # API testing files (REST client)
├── routes/            # API routes
├── services/          # Business logic
└── utils/             # Utility functions
```

### Layer Responsibilities

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement business logic
3. **Repositories**: Provide an abstraction layer for data operations
4. **DAOs**: Handle database operations
5. **DTOs**: Transform data between layers
6. **Models**: Define data schemas
7. **Middlewares**: Process requests before reaching route handlers
8. **Utils**: Provide helper functions across the application

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/OmarReales/node-rest-mvc-api.git
   cd node-rest-mvc-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3001
   URL_MONGODB=mongodb://localhost:27017/finalbe2
   COOKIE_SECRET=your_cookie_secret
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

The application uses environment-specific configurations:

```javascript
// src/config/config.js
export default {
  PORT: process.env.PORT || 3001,
  URL_MONGODB: process.env.URL_MONGODB || "mongodb://localhost:27017/finalbe2",
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};
```

## API Endpoints

### Authentication

- `POST /api/sessions/register` - Register a new user
- `POST /api/sessions/login` - User login
- `GET /api/sessions/logout` - User logout
- `GET /api/sessions/current` - Get current user info

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:uid` - Get user by ID
- `PUT /api/users/:uid` - Update user
- `DELETE /api/users/:uid` - Delete user

### Products

- `GET /api/products` - Get all products (with filtering, pagination and sorting)
- `GET /api/products/:pid` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:pid` - Update product (admin only)
- `DELETE /api/products/:pid` - Delete product (admin only)

### Carts

- `GET /api/carts` - Get all carts
- `GET /api/carts/:cid` - Get cart by ID
- `POST /api/carts` - Create new cart
- `POST /api/carts/:cid/product/:pid` - Add product to cart
- `PUT /api/carts/:cid` - Update entire cart
- `DELETE /api/carts/:cid/products/:pid` - Remove product from cart
- `DELETE /api/carts/:cid` - Empty cart

### Tickets (Orders)

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:tid` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `DELETE /api/tickets/:tid` - Delete ticket

## Authentication

The application uses JWT (JSON Web Tokens) for authentication through Passport.js:

1. **JWT Strategy**: For protected routes
2. **Local Strategy**: For username/password login

Authentication flow:

1. User registers or logs in
2. Server generates JWT token
3. Token is stored in HTTP-only cookie
4. Protected routes require valid JWT token
5. `authorization` middleware checks user role

Example of a protected route:

```javascript
router.post("/", passportCall("jwt"), authorization("admin"), createProduct);
```

## Error Handling

The application implements a centralized error handling middleware that:

1. Captures all errors thrown in the application
2. Maps errors to appropriate HTTP status codes
3. Formats error responses consistently
4. Logs errors with appropriate severity levels

```javascript
// Example of error handling
export const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "An internal server error occurred";

  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error: " + err.message;
    logger.warn(`Validation error: ${err.message}`);
  }

  // More error type handling...

  res.status(status).json({ status: "error", message });
};
```

## Logging

The application uses Winston for multi-level logging:

- Console output for development
- File rotation for production logs
- Different log levels based on environment:
  - Development: debug, http, info, warn, error
  - Production: warn, error
- HTTP request logging middleware

Logs are stored in:

- `logs/combined-YYYY-MM-DD.log` - All logs
- `logs/error-YYYY-MM-DD.log` - Error logs only

## Examples

### Creating a new product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: cookieName=your_jwt_token" \
  -d '{
    "title": "Sample Product",
    "description": "This is a sample product",
    "price": 29.99,
    "thumbnail": "https://example.com/product.jpg",
    "code": "PROD123",
    "stock": 100,
    "category": "electronics"
  }'
```

### Get products with pagination and filters

```bash
curl -X GET "http://localhost:3001/api/products?limit=10&page=1&sort=desc&category=electronics&minPrice=20&maxPrice=100"
```

### Adding product to cart

```bash
curl -X POST http://localhost:3001/api/carts/64a1b2c3d4e5f6g7h8i9j0k/product/09j8h7g6f5e4d3c2b1a \
  -H "Content-Type: application/json" \
  -H "Cookie: cookieName=your_jwt_token" \
  -d '{
    "quantity": 2
  }'
```

### User registration

```bash
curl -X POST http://localhost:3001/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "secure_password",
    "age": 30
  }'
```

## License

ISC
