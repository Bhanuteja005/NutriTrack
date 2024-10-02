
# NutriTrack

NutriTrack is a web application that allows users to generate personalized recipes based on their dietary preferences and restrictions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)


## Features

- Generate recipes based on user-provided ingredients, meal types, and dietary restrictions.
- User authentication via Google.
- Dynamic recipe suggestions based on user allergies and chronic diseases.

## Technologies Used

- **Frontend:** React, Vite, Firebase
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **CSS Framework:** Bootstrap
- **Other Libraries:** CORS, dotenv

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd NutriTrack
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project with the following variables:
   ```plaintext
   VITE_FIREBASE_API_KEY=<your-firebase-api-key>
   VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   VITE_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
   VITE_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
   VITE_FIREBASE_APP_ID=<your-firebase-app-id>
   VITE_FIREBASE_MEASUREMENT_ID=<your-firebase-measurement-id>
   VITE_GOOGLE_API_KEY=<your-google-api-key>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

