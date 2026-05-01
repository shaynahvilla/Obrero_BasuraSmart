# BasuraSmart Backend API

Backend server for the BasuraSmart waste management mobile application.

## Features

- **Authentication**: Phone-based login with OTP verification
- **User Management**: Support for residents and collectors
- **Schedule Management**: Waste collection schedules with different waste types
- **Route Management**: Collection routes with GPS stops
- **Collection Tracking**: Real-time collection status and statistics
- **RESTful API**: Clean, documented endpoints
- **TypeScript**: Full type safety
- **PostgreSQL**: Reliable database with proper relationships

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT with session management
- **Validation**: Express Validator
- **OTP**: Twilio (SMS) + Nodemailer (Email)
- **Security**: Helmet, CORS, bcryptjs

## API Endpoints

### Authentication
- `POST /api/auth/login` - Send OTP to phone
- `POST /api/auth/verify` - Verify OTP and get token
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule by ID
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route with stops
- `POST /api/routes` - Create new route
- `POST /api/routes/:id/stops` - Add stop to route
- `PUT /api/routes/:routeId/stops/:stopId` - Update stop status
- `DELETE /api/routes/:id` - Delete route
- `DELETE /api/routes/:routeId/stops/:stopId` - Delete stop

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get collection by ID
- `POST /api/collections` - Record new collection (collector only)
- `PUT /api/collections/:id` - Update collection
- `GET /api/collections/stats/summary` - Get collection statistics

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `phone_number` (VARCHAR, Unique)
- `full_name` (VARCHAR)
- `email` (VARCHAR, Optional)
- `user_type` (ENUM: resident, collector)
- `address` (TEXT, Optional)
- `is_verified` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### OTP Codes
- `id` (UUID, Primary Key)
- `phone_number` (VARCHAR)
- `code` (VARCHAR)
- `expires_at` (TIMESTAMP)
- `is_used` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Schedules
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT, Optional)
- `waste_type` (ENUM: biodegradable, non-biodegradable, recyclable)
- `collection_date` (DATE)
- `collection_time` (TIME)
- `status` (ENUM: scheduled, completed, cancelled)
- `created_at`, `updated_at` (TIMESTAMP)

### Routes
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT, Optional)
- `collector_id` (UUID, Foreign Key to Users)
- `status` (ENUM: active, inactive)
- `created_at`, `updated_at` (TIMESTAMP)

### Route Stops
- `id` (UUID, Primary Key)
- `route_id` (UUID, Foreign Key to Routes)
- `name` (VARCHAR)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `address` (TEXT, Optional)
- `sequence_number` (INTEGER)
- `status` (ENUM: pending, completed, skipped)
- `created_at`, `updated_at` (TIMESTAMP)

### Collections
- `id` (UUID, Primary Key)
- `route_stop_id` (UUID, Foreign Key to Route Stops)
- `collector_id` (UUID, Foreign Key to Users)
- `resident_id` (UUID, Foreign Key to Users, Optional)
- `schedule_id` (UUID, Foreign Key to Schedules, Optional)
- `collection_time` (TIMESTAMP)
- `waste_type` (ENUM: biodegradable, non-biodegradable, recyclable)
- `weight_kg` (DECIMAL, Optional)
- `notes` (TEXT, Optional)
- `status` (ENUM: completed, missed, skipped)
- `created_at` (TIMESTAMP)

### User Sessions
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users)
- `token_hash` (VARCHAR)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**
```bash
# Create PostgreSQL database
createdb basurasmart

# The app will auto-create tables on first run
```

4. **Start development server**
```bash
npm run dev
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=basurasmart
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OTP
OTP_EXPIRY=10
OTP_LENGTH=6

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email (for email OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### API Documentation

The API follows RESTful conventions:

**Response Format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Format:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Testing

Use the demo credentials from the mobile app:
- **Resident**: Phone `09123456789`, OTP `123456`
- **Collector**: Phone `09987654321`, OTP `123456`

## Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Set production environment variables**
```bash
export NODE_ENV=production
export JWT_SECRET=your-production-secret
# ... other production variables
```

3. **Start the server**
```bash
npm start
```

4. **Use PM2 for process management**
```bash
npm install -g pm2
pm2 start dist/index.js --name basurasmart-api
```

## Security Features

- JWT token authentication with expiration
- Session management with token hashing
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS protection
- Helmet security headers
- Rate limiting (recommended for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
