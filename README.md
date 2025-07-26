<div align="center">

[<img src="https://via.placeholder.com/200x200/4285F4/ffffff?text=💬" width="100" alt="CloudChat logo">](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application)

# CloudChat

**Open Source Real-Time Chat Application**

[**Live Demo**](https://drive.google.com/file/d/14_VyMQ1rAvhYhJKivIGPte9jzyfL6FCk/view?usp=drive_link) | [**Documentation**](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application#readme) | [**Contributing**](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/blob/main/CONTRIBUTING.md) | [**Issues**](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/issues) |
[**Discussions**](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/discussions) | [**Security**](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/blob/main/SECURITY.md)

[![Shield: License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Shield: Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-limegreen.svg)](#contributing) [![Shield: React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Shield: Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange.svg)](https://firebase.google.com/) [![Shield: TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

</div>

**CloudChat** is an open source real-time chat application built with modern web technologies. The application empowers users to communicate instantly with secure messaging, group chats, and real-time notifications. Designed for scalability and ease of use with a mobile-first responsive design.

<div align="center">

[<img src="https://via.placeholder.com/600x400/1a202c/ffffff?text=CloudChat+Demo+Preview" width="600" alt="Preview image of CloudChat application">](https://drive.google.com/file/d/14_VyMQ1rAvhYhJKivIGPte9jzyfL6FCk/view?usp=drive_link)

</div>

## Why CloudChat?

CloudChat is for you if you are...

- 💬 looking for a **privacy-focused** chat application
- 🔒 valuing **end-to-end security** and data ownership
- 👥 managing **team communications** or group projects
- 🚀 wanting a **modern, fast** messaging experience
- 📱 needing **cross-platform** compatibility (mobile & desktop)
- 🎨 appreciating **clean, intuitive** user interfaces
- 🛠️ interested in **self-hosting** your chat solution
- 🌐 requiring **real-time** communication features
- 💡 contributing to **open source** projects
- 🆓 preferring **free alternatives** to commercial chat apps

## ✨ Features

- ✅ **Secure Authentication** - Firebase Auth with multiple providers
- ✅ **Real-time Messaging** - Instant message delivery with Firestore
- ✅ **Group Chats** - Create and manage group conversations
- ✅ **Responsive Design** - Beautiful UI that works on all devices
- ✅ **Push Notifications** - Never miss a message
- ✅ **Emoji Support** - Express yourself with emoji picker
- ✅ **Dark/Light Mode** - Choose your preferred theme
- ✅ **User Profiles** - Customizable user profiles and avatars
- ✅ **Privacy Controls** - Granular privacy settings
- ✅ **Real-time Updates** - Live typing indicators and message status

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application.git
   cd cloudchat-realtime-chat-application/cloudchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Update `src/firebaseConfig.ts` with your Firebase configuration:
   ```typescript
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /messages/{messageId} {
         allow read, write: if request.auth != null;
       }
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /groups/{groupId} {
         allow read, write: if request.auth != null && 
           request.auth.uid in resource.data.members;
       }
     }
   }
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Build Tool** | Vite |
| **Backend** | Firebase (Firestore, Auth, Storage) |
| **UI Components** | Radix UI, Lucide React |
| **State Management** | TanStack Query |
| **Routing** | React Router |
| **Styling** | Tailwind CSS, CSS Modules |
| **Development** | ESLint, TypeScript |

## 🚀 Self-hosting

CloudChat can be easily self-hosted on your own infrastructure. We provide comprehensive documentation and support for various deployment methods.

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Firestore and Authentication enabled
- Basic knowledge of web deployment

### Environment Variables

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `VITE_FIREBASE_API_KEY` | `string` | | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `string` | | Your Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `string` | | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `string` | | Your Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `string` | | Your Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | `string` | | Your Firebase app ID |

## 📁 Project Structure

```
cloudchat/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (buttons, inputs, etc.)
│   │   ├── AuthModal.tsx # Authentication modal
│   │   ├── ChatRoom.tsx  # Main chat interface
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── package.json
└── vite.config.ts
```
<<<<<<< HEAD
=======
## 🎥 Demo Video
https://youtu.be/DL_W2Y7nIyg?si=b5JvqeW6ptYazevC
>>>>>>> 5076a190dc8e1380499fead0db45cad3e6a5f282

## 🤝 Contributing

We love contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow the existing code style (ESLint configuration)
- Write meaningful commit messages
- Add tests for new features

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/issues) with:

- **Bug Reports**: Steps to reproduce, expected vs actual behavior, screenshots
- **Feature Requests**: Clear description of the feature and use case

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

If you need help or have questions:

- 📧 Email: [your-email@example.com]
- 💬 [GitHub Discussions](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/discussions)
- 🐛 [Issue Tracker](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/issues)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/DineshPriyanthaGH">DineshPriyanthaGH</a>
</div>
