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
   git clone https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application.git
   cd cloudchat-realtime-chat-application
   ```
2. Install dependencies:
   ```bash
   npm install
   ```


## Firebase Setup
- Update `src/firebase.Ts` with your Firebase project config if needed.
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
## 🎥 Demo Video

📺 [Watch the Demo](https://drive.google.com/file/d/14_VyMQ1rAvhYhJKivIGPte9jzyfL6FCk/view?usp=drive_link)

---



