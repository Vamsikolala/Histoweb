# HistoQuanta

A histopathology analysis platform for doctors — featuring an iOS app, a web dashboard, and a PHP REST API backend.

## Project Structure

```
Histoquanta 2/
├── backend/   → PHP REST API + MySQL database
├── web/       → React + TypeScript web dashboard (Vite)
└── app/       → iOS app (SwiftUI, Xcode)
```

## Prerequisites

| Tool       | Version  | Purpose                        | Install                                      |
|------------|----------|--------------------------------|----------------------------------------------|
| PHP        | ≥ 8.0    | Backend API server             | `brew install php`                           |
| MySQL      | ≥ 5.7    | Database                       | `brew install mysql` or use MAMP             |
| Node.js    | ≥ 18     | Web frontend dev server        | `brew install node`                          |
| npm        | ≥ 9      | Package manager (comes with Node) | Included with Node.js                     |
| Xcode      | ≥ 15     | iOS app development            | Mac App Store                                |

## Quick Start

### 1. Database Setup

```bash
# Start MySQL
mysql.server start

# Create the database and tables
mysql -u root < backend/setup_database.sql
```

### 2. Backend (PHP API)

```bash
cd backend
php -S localhost:8000
```

The backend dashboard will be available at **http://localhost:8000**

### 3. Web Frontend (React)

```bash
cd web
npm install       # First time only
npm run dev
```

The web app will be available at **http://localhost:5173**

### 4. iOS App

```bash
open "app/HistoQuanta 4/HistoQuanta 4.xcodeproj"
```

Build and run on a simulator or device from Xcode.

## Configuration

### Database Connection

Edit `backend/db.php` to change the MySQL credentials:

```php
$host = "localhost";
$user = "root";
$pass = "";           // Set your MySQL password
$dbname = "histoquanta";
```

### Email (OTP / Password Reset)

Edit `backend/email_config.php` with your SMTP credentials:

```php
return [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_user' => 'your-email@gmail.com',
    'smtp_pass' => 'your-app-password'
];
```

### Backend URL (for Web Frontend)

The web frontend proxies API requests to the backend. Update `web/vite.config.ts` if your backend runs on a different port:

```ts
proxy: {
  '^/.*\\.php': {
    target: 'http://localhost:8000',  // Change this
    changeOrigin: true,
  }
}
```

### Backend URL (for iOS App)

Update the base URL in the iOS app's network configuration to point to your backend server's IP address.

## API Endpoints

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | `/doctor_signup.php`         | Register a new doctor          |
| POST   | `/doctor_login.php`          | Doctor login                   |
| GET    | `/doctor_profile.php`        | Get doctor profile             |
| POST   | `/update_doctor_profile.php` | Update doctor profile          |
| POST   | `/add_patient.php`           | Add a new patient              |
| GET    | `/get_patients.php`          | List patients for a doctor     |
| GET    | `/search_patient.php`        | Search patients                |
| GET    | `/patient_profile.php`       | Get patient details            |
| POST   | `/update_patient.php`        | Update patient info            |
| POST   | `/delete_patient.php`        | Delete a patient               |
| GET    | `/get_next_patient_id.php`   | Get next available patient ID  |
| POST   | `/add_disease.php`           | Add disease/report entry       |
| POST   | `/add_analysis_report.php`   | Add automated analysis report  |
| POST   | `/delete_report.php`         | Delete a report                |
| POST   | `/send_otp.php`              | Send OTP for verification      |
| POST   | `/verify_otp.php`            | Verify OTP code                |
| POST   | `/forgot_password_request.php` | Request password reset       |
| POST   | `/reset_password_otp.php`    | Reset password with OTP        |

## License

Private project — all rights reserved.
