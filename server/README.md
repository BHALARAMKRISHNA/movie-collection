# 🚀 Backend - Express Server

> Type-safe Express.js backend API for managing movies and TV shows with MySQL database and Drizzle ORM.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Database](#-database)
- [Architecture](#-architecture)
- [Error Handling](#-error-handling)
- [Performance](#-performance)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MySQL 8.0+ running
- Database `movie_db` created

### Start Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:3000`

---

## 📁 Project Structure

```
server/
├── index.ts                        # Server entry point
├── db.ts                           # Database initialization
├── routes.ts                       # API endpoints
├── storage.ts                      # Database operations
├── vite.ts                         # Vite integration
└── README.md                       # This file
```

### Key Files

**index.ts** - Express app setup
- Middleware configuration
- Route registration
- Server initialization

**db.ts** - Database connection
- MySQL pool creation
- Drizzle ORM setup
- Connection testing
- Error handling

**routes.ts** - API endpoints
- GET /api/movies - List movies
- POST /api/movies - Create movie
- GET /api/movies/:id - Get movie
- PUT /api/movies/:id - Update movie
- DELETE /api/movies/:id - Delete movie

**storage.ts** - Data layer
- DatabaseStorage class
- Query execution
- Error handling

**vite.ts** - Dev integration
- HMR configuration
- Vite plugin setup

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

Key packages installed:
- `express` - Web framework
- `mysql2/promise` - MySQL driver
- `drizzle-orm` - Database ORM
- `zod` - Schema validation
- `typescript` - Type safety

### 2. Verify Installation

```bash
npm list express mysql2 drizzle-orm
```

### 3. Check Database

```bash
# Verify database exists
# Open MySQL Workbench
# Look for 'movie_db' in SCHEMAS
# Verify 'movies' table exists
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
DATABASE_URL="mysql://root:6193%40Bk@127.0.0.1:3306/movie_db"
USE_MYSQL=true
```

### Connection String Format

```
mysql://[username]:[password]@[host]:[port]/[database]
```

| Component | Example | Notes |
|-----------|---------|-------|
| Protocol | mysql:// | Required |
| Username | root | Default MySQL user |
| Password | 6193%40Bk | URL-encoded (@ = %40) |
| Host | 127.0.0.1 | localhost |
| Port | 3306 | Default MySQL port |
| Database | movie_db | Schema name |

### Database URL Encoding

If your password contains special characters:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`

Example:
```
Raw password: root@123:abc/def
Encoded: root%40123%3Aabc%2Fdef
URL: mysql://root:root%40123%3Aabc%2Fdef@127.0.0.1:3306/movie_db
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api
```

### Movies Endpoints

#### Get All Movies
```
GET /api/movies
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |

**Example Request:**
```bash
curl "http://localhost:3000/api/movies?page=1&limit=20"
```

**Response:**
```json
{
  "movies": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "type": "Movie",
      "director": "Frank Darabont",
      "budget": 25000000,
      "location": "Ohio, USA",
      "duration": 142,
      "year": 1994,
      "additionalDetails": "Based on Stephen King novella",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "pages": 1
}
```

#### Create Movie
```
POST /api/movies
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Movie Title",
  "type": "Movie",
  "director": "Director Name",
  "year": 2024,
  "budget": 50000000,
  "location": "Location",
  "duration": 120,
  "additionalDetails": "Optional details"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Movie Title",
  "type": "Movie",
  "director": "Director Name",
  "year": 2024,
  "budget": 50000000,
  "location": "Location",
  "duration": 120,
  "additionalDetails": "Optional details",
  "createdAt": "2024-01-02T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

#### Get Single Movie
```
GET /api/movies/:id
```

**Example:**
```bash
curl "http://localhost:3000/api/movies/1"
```

**Response:**
```json
{
  "id": 1,
  "title": "The Shawshank Redemption",
  "type": "Movie",
  "director": "Frank Darabont",
  "budget": 25000000,
  "location": "Ohio, USA",
  "duration": 142,
  "year": 1994,
  "additionalDetails": "Based on Stephen King novella",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Movie
```
PUT /api/movies/:id
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "year": 2025
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "type": "Movie",
  "director": "Frank Darabont",
  "budget": 25000000,
  "location": "Ohio, USA",
  "duration": 142,
  "year": 2025,
  "additionalDetails": "Based on Stephen King novella",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

#### Delete Movie
```
DELETE /api/movies/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation error",
  "details": "Invalid movie data"
}
```

**404 Not Found:**
```json
{
  "error": "Movie not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## 🗄️ Database

### Schema

**movies table:**
```sql
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  director VARCHAR(255) NOT NULL,
  budget DECIMAL(10, 2) DEFAULT NULL,
  location VARCHAR(500) DEFAULT NULL,
  duration INT DEFAULT NULL,
  year INT NOT NULL,
  additional_details TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
             ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_year (year),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Indexes

- `PRIMARY KEY (id)` - Fast lookups by ID
- `INDEX idx_created_at` - Sort by creation date
- `INDEX idx_year` - Filter by year
- `INDEX idx_type` - Filter by type (Movie/TV Show)

### Database Operations

All operations handled by `DatabaseStorage` class in `storage.ts`:

```typescript
// Get all movies
const movies = await storage.getMovies(page, limit);

// Get single movie
const movie = await storage.getMovie(id);

// Create movie
const newMovie = await storage.createMovie(data);

// Update movie
const updated = await storage.updateMovie(id, data);

// Delete movie
await storage.deleteMovie(id);
```

---

## 🏛️ Architecture

### Request Flow

```
HTTP Request
    ↓
Express Middleware
    ↓
Route Handler (routes.ts)
    ↓
Validation (Zod)
    ↓
Storage Layer (storage.ts)
    ↓
Drizzle ORM (db.ts)
    ↓
MySQL Query
    ↓
Database Execute
    ↓
Response (JSON)
```

### Layered Architecture

**Presentation Layer** (routes.ts)
- HTTP endpoints
- Request parsing
- Response formatting

**Validation Layer** (Zod schemas)
- Input validation
- Type checking
- Error messages

**Business Logic Layer** (storage.ts)
- Data transformation
- Business rules
- Error handling

**Data Access Layer** (db.ts)
- Database queries
- ORM operations
- Connection management

**Database Layer** (MySQL)
- Data persistence
- Indexes
- Constraints

### Data Flow Example

```
POST /api/movies {title: "...", ...}
    ↓
parseJSON middleware
    ↓
validateMovieInput(Zod schema)
    ↓
storage.createMovie(validated data)
    ↓
db.insert(movies).values(data)
    ↓
MySQL: INSERT INTO movies ...
    ↓
Return new movie object
    ↓
200 OK with movie data
```

---

## ✅ Validation

### Input Validation

Using **Zod** for schema validation:

```typescript
// In shared/schema.ts
export const createMovieSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['Movie', 'TV Show']),
  director: z.string().min(1),
  year: z.number().int(),
  budget: z.number().optional(),
  location: z.string().optional(),
  duration: z.number().optional(),
  additionalDetails: z.string().optional(),
});
```

### Validation Examples

Valid request:
```json
{
  "title": "The Shawshank Redemption",
  "type": "Movie",
  "director": "Frank Darabont",
  "year": 1994
}
```

Invalid (missing required field):
```json
{
  "title": "The Shawshank Redemption",
  "director": "Frank Darabont",
  "year": 1994
}
```
Returns: `400 Bad Request - Missing 'type' field`

---

## ❌ Error Handling

### Error Types

**Client Errors (4xx):**
- 400 Bad Request - Invalid data
- 404 Not Found - Resource doesn't exist
- 409 Conflict - Business logic violation

**Server Errors (5xx):**
- 500 Internal Server Error - Unexpected error
- 503 Service Unavailable - Database down

### Error Handling Example

```typescript
try {
  const movie = await storage.getMovie(id);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
}
```

### Logging

Server logs:
- Request/response times
- Database queries
- Errors and stack traces
- Connection status

Check console output during `npm run dev`

---

## ⚡ Performance

### Database Optimization

1. **Indexes** - Fast queries on common fields
   - id (primary key)
   - year (filtering)
   - type (filtering)
   - created_at (sorting)

2. **Connection Pool** - Reuse connections
   - Default: 10 connections
   - Configurable in `db.ts`

3. **Query Optimization**
   - Pagination (LIMIT/OFFSET)
   - Projection (only needed fields)
   - Sorting (indexed fields)

### Query Performance

**Example - Get 20 movies:**
```sql
SELECT * FROM movies 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;
```
Expected: < 50ms with index

**Example - Filter by type:**
```sql
SELECT * FROM movies 
WHERE type = 'Movie' 
ORDER BY created_at DESC 
LIMIT 20;
```
Expected: < 100ms with index

### Benchmarking

```bash
# Monitor query performance
# Check MySQL slow query log
# Use MySQL Workbench execution plan

# Network monitoring
# DevTools Network tab
# Check response times
```

---

## 🔐 Security

### Best Practices Implemented

1. **Input Validation** - Zod schemas validate all inputs
2. **SQL Injection Prevention** - Drizzle ORM prevents injection
3. **Error Messages** - Don't expose sensitive info
4. **CORS** - Configure for frontend domain
5. **Rate Limiting** - Optional middleware

### Recommended Security Measures

```typescript
// Add to index.ts
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## 📝 Logging

### Log Levels

```typescript
console.log('ℹ️  Info message');      // General info
console.error('❌ Error message');     // Errors
console.warn('⚠️  Warning message');   // Warnings
```

### Request Logging

Add middleware for request logging:

```typescript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Database Logging

Enable Drizzle logging:

```typescript
// In db.ts
db = drizzle(connection, { 
  schema,
  logger: true  // Enable query logging
});
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Creates:
- `dist/index.js` - Bundled server
- Dependencies included with `--packages=external`

### Start Production Server

```bash
npm start
```

Or with PM2:
```bash
pm2 start dist/index.js --name "movie-api"
```

### Environment Setup

Create `.env` on production server:
```env
DATABASE_URL="mysql://user:password@host:port/database"
USE_MYSQL=true
NODE_ENV=production
```

### Deployment Platforms

#### Heroku
```bash
git push heroku main
heroku config:set DATABASE_URL="mysql://..."
```

#### Railway
```bash
railway up
```

#### Self-Hosted (VPS)
```bash
# SSH into server
ssh user@server.com

# Clone and setup
git clone <repo>
cd my-collection
npm install
npm run build

# Start with systemd
sudo systemctl start movie-api
```

---

## 🆘 Troubleshooting

### Connection Errors

**"Connection refused at 127.0.0.1:3306"**

```bash
# Check MySQL is running
# Windows: Services → MySQL80
# Mac: brew services start mysql
# Linux: sudo service mysql start

# Verify port
netstat -an | grep 3306
```

**"Unknown database 'movie_db'"**

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE movie_db;"

# Run schema
mysql -u root -p movie_db < database-schema.sql
```

**"Access denied for user 'root'"**

```bash
# Verify credentials in .env
# Test connection with MySQL Workbench
# Check password encoding (@ = %40)
```

### Query Errors

**"Table 'movie_db.movies' doesn't exist"**

```bash
# Run database schema
# In MySQL Workbench:
# File → Open SQL Script → database-schema.sql
# Execute (Ctrl + Shift + Enter)
```

**"Duplicate entry"**

- Check unique constraints
- Verify no duplicate IDs

### Server Issues

**"Port 3000 already in use"**

```bash
# Kill process using port
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000 | kill -9 <PID>
```

**"Module not found"**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**"TypeScript errors"**

```bash
npm run check
# Fix errors in code
```

### Performance Issues

**"Slow API responses"**

1. Check database indexes
2. Monitor MySQL with Workbench
3. Check network latency
4. Review query complexity

**"High memory usage"**

1. Check connection pool size
2. Monitor for memory leaks
3. Check for large queries

---

## 📚 Resources

### Documentation
- [Express.js Guide](https://expressjs.com/guide.html)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- **MySQL Workbench** - Database management
- **Postman** - API testing
- **Thunder Client** - VS Code API client
- **DBeaver** - Database browser

---

## 🤝 Contributing

See main [README.md](../README.md#-contributing) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

<div align="center">

**[⬆ Back to top](#-backend---express-server)**

</div>