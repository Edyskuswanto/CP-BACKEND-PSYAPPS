-- migrations/createTables.sql

-- Create Patients table
CREATE TABLE IF NOT EXISTS Patients (
  patient_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  gender VARCHAR(10),
  email VARCHAR(100)
);

-- Create Doctors table
CREATE TABLE IF NOT EXISTS Doctors (
  doctor_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
