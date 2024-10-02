

# NutriTrack
An AI-based nutrition companion

## Description
NutriTrack is an AI-powered nutrition companion designed to help you achieve your health goals, manage your diet, and maintain a balanced lifestyle. With features like personalized recipe suggestions, goal tracking, and a smart shopping list, NutriTrack empowers you to make healthier choices every day.

## Features
- **Profile Management**: Set up and manage your personal health profile.
- **Goal Tracking**: Define health goals and track your progress over time.
- **Recipe Suggestions**: Get AI-curated healthy recipe recommendations tailored to your preferences.
- **Bookmarks**: Save your favorite recipes for easy access later.
- **Shopping List**: Automatically generate a shopping list based on selected recipes.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js** (v14 or later)
- **npm** (v6 or later) or **yarn** (v1.22 or later)
- **Firebase** account for authentication and data storage

## Setup

Follow these steps to set up and run the project locally:

### 1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bhanuteja005/NutriTrack.git
   cd NutriTrack
   ```

### 2. **Install dependencies**:

   - Using npm:
     ```bash
     npm install
     ```
   - Or using yarn:
     ```bash
     yarn install
     ```

### 3. **Create a `.env` file**:
   Create a `.env` file in the root directory of the project and add your Firebase configuration keys:
   ```bash
   VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
VITE_FIREBASE_MEASUREMENT_ID=<your-firebase-measurement-id>
VITE_GOOGLE_API_KEY=<your-google-api-key>

   ```

### 4. **Start the development server**:

   - Using npm:
     ```bash
     npm start
     ```
   - Or using yarn:
     ```bash
     yarn start
     ```

   The development server should now be running at `http://localhost:3000`.

### 5. **Firebase Setup** (Optional but recommended):
   - Ensure you have Firebase configured for authentication and Firestore database.
   - Go to the [Firebase Console](https://console.firebase.google.com/) to set up your project and obtain the credentials required in the `.env` file.

## Additional Setup (Optional)

### 1. **Enable Firebase Authentication**:
   - In the Firebase Console, go to **Authentication** and enable the sign-in methods you prefer (e.g., Email/Password).

### 2. **Set Up Firestore**:
   - In the Firebase Console, go to **Firestore Database** and set up a new database. This is where the app will store user profiles, goals, and bookmarks.

### 3. **Install Firebase CLI** (for deploying):
   ```bash
   npm install -g firebase-tools
   ```
   You can use this tool to deploy your app to Firebase Hosting.

## Build for Production

To create an optimized production build, run the following command:
```bash
npm run build
```
Or with yarn:
```bash
yarn build
```
