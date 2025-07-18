# CloudChat

A cloud-based real-time chat application built with React and Firebase.

## Features
- User authentication (Firebase Auth)
- Real-time messaging (Firestore)
- Secure Firebase rules
- Responsive UI/UX
- Modular, clean code

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd cloudchat
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Firebase Setup
- Update `src/firebase.js` with your Firebase project config if needed.
- Set Firestore security rules as described below.

## Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Demo
- [Demo Link or attach screen recording here]

## Project Flow Report
- See `report.pdf` for architecture, technologies, and features.

## License
MIT
