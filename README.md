# Three Tier App

Frontend: React  
Backend: Node + Express  
Database: MySQL (RDS)  

## Setup Database

Create DB in RDS:

CREATE DATABASE testdb;
USE testdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255)
);

## Run Locally (Optional)

docker compose up --build