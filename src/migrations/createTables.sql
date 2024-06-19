-- Create Patients table
CREATE TABLE IF NOT EXISTS Patients (
  patient_id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(50)
);

-- Create Doctors table
CREATE TABLE IF NOT EXISTS Doctors (
  doctor_id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(50)
);