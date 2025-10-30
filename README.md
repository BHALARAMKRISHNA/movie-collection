
<h1 align="center"> Favorite Movie Collections</h1>

<p align="center">
  <strong>Movies / TV Shows Management Application</strong><br>
  <em>A full-stack web app for managing movies and TV shows efficiently.</em>
</p>

---

## Overview

**Movie Collection** is a full-stack web application designed to organize, manage, and explore your favorite **movies and TV shows** with ease.  
Built using a modern tech stack for smooth performance and scalability.

---

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

   ---
## Deployment link:
https://movie-collectionss.onrender.com/
   
   
## Screenshots:
Splash page
<img width="959" height="413" alt="1" src="https://github.com/user-attachments/assets/3d4b054f-7688-4829-af3d-9addd953caf0" />

Login Page:
<img width="959" height="416" alt="2" src="https://github.com/user-attachments/assets/e5fe5bf1-00e5-4508-ba37-e42ef9f06a92" />

Home page:
<img width="955" height="414" alt="3" src="https://github.com/user-attachments/assets/f769e2e5-6f04-41dd-9727-6bc3a042980f" />  <img width="959" height="415" alt="4" src="https://github.com/user-attachments/assets/e470bd5b-c658-455f-83ee-a91ae0a89fbb" />

Adding Entry:
<img width="959" height="416" alt="5" src="https://github.com/user-attachments/assets/184a0d9f-80c7-4ace-a1fb-46a60e32ee20" />  <img width="959" height="416" alt="6" src="https://github.com/user-attachments/assets/bdc4e3b8-9010-4f55-96ce-4e097a387f59" />  <img width="959" height="227" alt="7" src="https://github.com/user-attachments/assets/bbe9aa9c-194c-47aa-ba0f-eacf16f5883e" />

Updating Entry:
<img width="959" height="415" alt="image" src="https://github.com/user-attachments/assets/5b46a4ff-91dc-4c39-ab74-bf4f12d1876b" />  <img width="959" height="412" alt="image" src="https://github.com/user-attachments/assets/c84a5862-48cb-49fa-aeb1-efbcd35ae67d" />  








