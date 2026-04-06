# ChatApp Authentication Backend (Laravel 11)

This is a professional-grade API built with **Laravel 11** that serves as the secure backend for the **ChatApp** mobile application. It integrates **Firebase Authentication** and **Firebase Realtime Database** while providing a robust **Email OTP** (One-Time Password) verification flow.

---

## 🚀 Key Features

- **Secure OTP Verification**: Generates 4-digit codes via Laravel Cache and delivers them using Gmail SMTP.
- **Firebase Auth Integration**: Handles secure user account creation and identity management.
- **Realtime Data Sync**: Stores user profiles (usernames, UIDs, and status) in Firebase Realtime Database.
- **Windows & Local Optimized**: Pre-configured for **REST transport** to bypass gRPC extension requirements commonly missing in Windows environments.
- **Strict Validation**: Enforces professional-grade input rules: letters-only usernames, valid email formats, and high-entropy passwords.

---

## 🛠 Tech Stack

- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth (Identity Platform)
- **Email Delivery**: Gmail SMTP (via Google App Passwords)
- **Security**: Laravel Cache (OTP storage) & Secure Service Account access

---

##### Installation setup

# Navigate to the backend folder
cd AuthBackend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

##### configure environment (.env)
Firebase configuration
FIREBASE_CREDENTIALS=storage/app/private/firebase/serviceAccount.json
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
GOOGLE_CLOUD_PHP_FIRESTORE_TRANSPORT=rest

##### Email configuration
Note: You must use a 16-character Google App Password, not your standard Gmail password.
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="ChatApp"

### Finalize Scafolding Running the Application
# Create API route file and configuration
php artisan install:api

# Refresh file maps and clear cache
composer dump-autoload
php artisan optimize:clear

php artisan serve

The API will be live at: http://127.0.0.1:8000
Connecting from Mobile
Android Emulator: Use http://10.0.2.2:8000/api
iOS Simulator: Use http://127.0.0.1:8000/api
Physical Device: Use your local WiFi IP (e.g., http://192.168.1.50:8000/api)


## 📦 Project Structure (Important)

For the API to communicate with Google, your Firebase Service Account file must be placed in the following private directory:

```text
AuthBackend/
└── storage/
    └── app/
        └── private/
            └── firebase/
                └── serviceAccount.json  <-- Place your Firebase JSON here

📋 API Reference
Method	Endpoint	Data Required	Description
POST	/api/send-otp	email, type (register/reset)	Generates and emails a 4-digit code.
POST	/api/register	username, email, password, otp	Verifies code and creates Firebase account.
POST	/api/login	email, password	Authenticates and returns User Profile.
POST	/api/reset-password	email, otp, password	Updates password after OTP verification.


