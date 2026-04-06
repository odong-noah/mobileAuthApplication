# ChatApp Mobile (React Native)

This is the official mobile frontend for the **ChatApp** platform, built using **React Native** and **TypeScript**. It features a professional authentication suite including Registration with Email OTP, Secure Login, and a multi-step Forgot Password flow.

---

## 🚀 Key Features

- **Professional UI**: Built with a clean, card-based design using `lucide-react-native` icons.
- **Email Verification**: Integrated OTP (One-Time Password) modal for account activation.
- **Security Logic**: Real-time Regex validation for usernames and high-entropy passwords.
- **Smooth UX**: Loading spinners, disabled states during API calls, and automatic keyboard management.
- **Cross-Platform**: Optimized for both Android and iOS environments.

---

## 🛠 Prerequisites

Before starting, ensure you have followed the official [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide.

- **Node.js**: v18 or newer
- **Java SDK**: v17 (for Android)
- **Xcode**: Latest version (for iOS)
- **CocoaPods**: For iOS dependency management

---

## ⚙️ Getting Started

### 1. Install Dependencies
Navigate to the project root and run:

npm install
# OR
yarn install

2. Configure API Connection
   
This app communicates with the Laravel AuthBackend. To ensure the connection works:
Android Emulator: Uses http://10.0.2.2:8000 (Automated in code).
iOS Simulator: Uses http://127.0.0.1:8000 (Automated in code).
Physical Device: Ensure your phone is on the same WiFi as your PC and update the baseUrl in your screens to your computer's local IP (e.g., 192.168.1.x).

🏃‍♂️ Running the App
Step 1: Start Metro
Metro is the JavaScript bundler for React Native. Start it in a dedicated terminal:
npm start
# OR
yarn start

Step 2: Build and Run
Android
Ensure your emulator is running or a device is connected:
npm run android
# OR
yarn android

IOS
First, install the native pods (macOS only):
cd ios && pod install && cd 
Then run the app:
npm run ios
# OR
yarn ios
