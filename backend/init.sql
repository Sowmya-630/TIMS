-- Initialize TIMS Database
CREATE DATABASE IF NOT EXISTS tims_database;
USE tims_database;

-- Create user for the application
CREATE USER IF NOT EXISTS 'tims_user'@'%' IDENTIFIED BY 'tims_password';
GRANT ALL PRIVILEGES ON tims_database.* TO 'tims_user'@'%';
FLUSH PRIVILEGES;
