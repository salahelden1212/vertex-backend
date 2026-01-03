# Vertex Backend API

RESTful API backend for Vertex Construction & Real Estate Management System built with Node.js, Express, and MongoDB.

## 🌟 Features

- **RESTful API Architecture**
- **JWT Authentication** with role-based access control
- **MongoDB Integration** with Mongoose ODM
- **File Upload** support with Multer
- **Input Validation** with Express Validator
- **Error Handling** middleware
- **CORS** enabled
- **Comprehensive API Documentation**

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Multer
- Express Validator
- CORS
- Dotenv

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vertex
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## 🚀 Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Seed admin user
npm run seed
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── clientController.js
│   ├── dashboardController.js
│   ├── paymentController.js
│   ├── propertyController.js
│   ├── projectController.js
│   ├── packageController.js
│   ├── userController.js
│   ├── contactController.js
│   ├── reportsController.js
│   ├── taskController.js
│   ├── milestoneController.js
│   ├── settingsController.js
│   └── uploadController.js
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT authentication
│   ├── permissions.js    # Role-based access
│   ├── upload.js         # File upload
│   ├── validator.js      # Input validation
│   └── errorHandler.js   # Error handling
├── models/               # Mongoose schemas
│   ├── AdminUser.js
│   ├── Client.js
│   ├── Property.js
│   ├── Payment.js
│   ├── Project.js
│   ├── Package.js
│   ├── ContactMessage.js
│   ├── Task.js
│   ├── Milestone.js
│   └── SiteSettings.js
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── clientRoutes.js
│   ├── propertyRoutes.js
│   ├── paymentRoutes.js
│   ├── projectRoutes.js
│   ├── packageRoutes.js
│   ├── userRoutes.js
│   ├── contactRoutes.js
│   ├── dashboardRoutes.js
│   ├── reportsRoutes.js
│   ├── taskRoutes.js
│   ├── milestoneRoutes.js
│   ├── settingsRoutes.js
│   └── uploadRoutes.js
├── utils/                # Utility functions
│   ├── asyncHandler.js
│   ├── auth.js
│   └── seedAdmin.js
├── uploads/              # Uploaded files directory
├── .env.example          # Environment variables example
├── .gitignore
├── package.json
└── server.js             # Entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create new package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Reports
- `GET /api/reports/payments` - Payments report
- `GET /api/reports/overdue` - Overdue payments report
- `GET /api/reports/profit` - Profit analysis report
- `GET /api/reports/clients` - Clients report

### Tasks & Milestones
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/milestones` - Get all milestones
- `POST /api/milestones` - Create new milestone
- `PUT /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

### File Upload
- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## 🔒 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Roles
- **admin** - Full access to all endpoints
- **manager** - Limited access to management features
- **viewer** - Read-only access

## 📝 Default Admin Credentials

After running `npm run seed`:
- **Email**: admin@vertex.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## 🛡️ Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Error handling middleware

## 📚 API Documentation

Full API documentation is available in `API_DOCUMENTATION.md`

## 🐛 Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🤝 Contributing

This is part of the Vertex Construction Management System.

## 📄 License

MIT License

## 🔗 Related Repositories

- Frontend: [vertex-frontend](https://github.com/YOUR_USERNAME/vertex-frontend)
