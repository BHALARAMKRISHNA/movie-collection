-- MySQL Database Schema for Movies/TV Shows Application
-- Run this SQL in your MySQL database to create the required table

CREATE DATABASE IF NOT EXISTS movie_db;
USE movie_db;

CREATE TABLE IF NOT EXISTS movies (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_year (year),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional)
INSERT INTO movies (title, type, director, budget, location, duration, year, additional_details) VALUES
('The Shawshank Redemption', 'Movie', 'Frank Darabont', 25000000.00, 'Ohio, USA', 142, 1994, 'Based on Stephen King novella'),
('Breaking Bad', 'TV Show', 'Vince Gilligan', NULL, 'New Mexico, USA', NULL, 2008, 'Five-season crime drama series'),
('The Godfather', 'Movie', 'Francis Ford Coppola', 6000000.00, 'New York, USA', 175, 1972, 'Crime drama masterpiece');
