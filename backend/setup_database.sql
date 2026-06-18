-- Histoquanta Database Setup Script
-- Database: histoquanta
-- Tables: doctor, patient, disease

CREATE DATABASE IF NOT EXISTS histoquanta;
USE histoquanta;

-- Doctor Table
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_no VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) DEFAULT '',
    hospital_name VARCHAR(255) DEFAULT '',
    phone_number VARCHAR(20) DEFAULT '',
    profile_pic VARCHAR(255) DEFAULT '',
    reset_otp VARCHAR(10),
    otp_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Table
CREATE TABLE IF NOT EXISTS patient (
    patient_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    doctor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

-- Disease Table (Manual Entries)
CREATE TABLE IF NOT EXISTS disease (
    disease_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id INT NOT NULL,
    report_type VARCHAR(255),
    diagnosis TEXT,
    notes TEXT,
    report LONGTEXT,
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

-- Analysis Reports Table (Automated Analysis)
CREATE TABLE IF NOT EXISTS patient_analysis_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    tissue_type VARCHAR(255) NOT NULL,
    marker VARCHAR(255) NOT NULL,
    total_score VARCHAR(255) NOT NULL,
    inference TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

