# 🏍️ BikeCare Tracker

A smart motorcycle maintenance app that tracks your daily rides and sends oil change reminders based on kilometers driven.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **📍 Daily Ride Tracking** - Log kilometers for each ride with date and notes
- **🔔 Smart Reminders** - Get notified when it's time for an oil change
- **📊 Analytics Dashboard** - View ride history and expense stats
- **🤖 AI Advisor** - Ask questions about your bike maintenance
- **📄 PDF Reports** - Download ride history as PDF
- **🔍 OCR Meter Reading** - Upload meter photos to auto-read kilometers

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Setup

Create `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS
- **Backend**: Firebase Auth, Firestore, Cloud Functions
- **Utilities**: Framer Motion, Recharts, jsPDF, Tesseract.js

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── history/          # Ride history
│   ├── analytics/        # Statistics
│   ├── advisor/          # AI chat
│   └── settings/         # App settings
├── components/           # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Firebase & utilities
└── functions/          # Firebase Cloud Functions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Enable **Cloud Firestore**
4. Create web app and copy config to `.env.local`

### Firestore Security Rules

```javascript
rules version = 2;
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /rides/{rideId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo)

## Pages

| Route | Description |
|-------|------------|
| `/` | Landing page |
| `/login` | Authentication |
| `/dashboard` | Main dashboard |
| `/history` | Ride history |
| `/analytics` | Stats & charts |
| `/advisor` | AI maintenance chat |
| `/settings` | App settings |

## License

MIT

## Screenshots

| Dashboard | Analytics |
|-----------|-----------|
| Main ride tracking view | Ride statistics |

---

<p align="center">Built with ❤️ for bike enthusiasts</p>