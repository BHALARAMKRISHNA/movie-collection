<<<<<<< HEAD
# movie-collection1
=======
# Movies/TV Shows Management Application

A full-stack web application for managing movies and TV shows with a React frontend, Express backend, and MySQL database.

---

## Quick Setup

```bash
npm install
npm run dev
```

---

## Backend Setup

### 1. Environment Configuration

Verify .env file in project root:

```env
DATABASE_URL="mysql://root:6193%40Bk@127.0.0.1:3306/movie_db"
USE_MYSQL=true
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Backend Server

```bash
npm run dev
```

Expected Output:
```
MySQL connection successful!
Using MySQL Database storage
serving on port 3000
```

Backend runs on: http://localhost:3000

---

## Frontend Setup

### Frontend Configuration

Frontend automatically starts with backend when running npm run dev

Frontend runs on: http://localhost:5173

### Technologies Used
- React 18
- Vite
- Tailwind CSS
- Radix UI
- React Query

---

## Database Setup & Schema

### 1. Start MySQL Server

Windows:
```powershell
net start MySQL80
```

Mac:
```bash
brew services start mysql
```

Linux:
```bash
sudo systemctl start mysql
```

### 2. Create Database & Table

Run database-schema.sql using one of these methods:

#### Method A: MySQL Workbench (GUI)
1. Open MySQL Workbench
2. File > Open SQL Script > Select database-schema.sql
3. Click Execute
4. Refresh schemas panel

#### Method B: Command Line
```powershell
mysql -u root -p < database-schema.sql
Password: 6193@Bk
```

### 3. Verify Database

```sql
USE movie_db;
SHOW TABLES;
DESCRIBE movies;
SELECT * FROM movies;
```

### Database Schema

```
movies TABLE
- id (INT, Primary Key, Auto Increment)
- title (VARCHAR 255) - Required
- type (VARCHAR 20) - "Movie" or "TV Show", Required
- director (VARCHAR 255) - Required
- budget (DECIMAL 10,2)
- location (VARCHAR 500)
- duration (INT)
- year (INT) - Required
- additional_details (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- Indexes: created_at, year, type
```

---

## Demo Credentials & Seed Data

### Database Connection
```
Host: 127.0.0.1
Port: 3306
Username: root
Password: 6193@Bk
Database: movie_db
```

### Sample Data (Auto-Created)

Three movies are automatically inserted:

1. The Shawshank Redemption
```json
{
  "id": 1,
  "title": "The Shawshank Redemption",
  "type": "Movie",
  "director": "Frank Darabont",
  "year": 1994,
  "duration": 142,
  "budget": 25000000.00,
  "location": "Ohio, USA",
  "additional_details": "Based on Stephen King novella"
}
```

2. Breaking Bad
```json
{
  "id": 2,
  "title": "Breaking Bad",
  "type": "TV Show",
  "director": "Vince Gilligan",
  "year": 2008,
  "duration": null,
  "budget": null,
  "location": "New Mexico, USA",
  "additional_details": "Five-season crime drama series"
}
```

3. The Godfather
```json
{
  "id": 3,
  "title": "The Godfather",
  "type": "Movie",
  "director": "Francis Ford Coppola",
  "year": 1972,
  "duration": 175,
  "budget": 6000000.00,
  "location": "New York, USA",
  "additional_details": "Crime drama masterpiece"
}
```

### View Seed Data

Via API:
```bash
curl http://localhost:3000/api/movies
```

Via MySQL:
1. Open MySQL Workbench
2. Use movie_db
3. Right-click movies table > Select Rows

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/movies | Create movie |
| GET | /api/movies | List all movies (with pagination) |
| GET | /api/movies/:id | Get single movie |
| PUT | /api/movies/:id | Update movie |
| DELETE | /api/movies/:id | Delete movie |

---

## Success Checklist

- MySQL server running
- movie_db database created
- 3 sample movies visible in database
- .env file configured
- Dependencies installed
- Backend running on port 3000
- Frontend running on port 5173
- Can access http://localhost:3000/api/movies
>>>>>>> ab9902b (Initial commit)
