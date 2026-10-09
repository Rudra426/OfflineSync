# OfflineSync

OfflineSync is a local-first note-taking application designed to work seamlessly without an internet connection. It stores data locally on the user's device first, allowing instant interactions and reads. When an internet connection is available, the app automatically syncs changes with the cloud.

## Features

* Local-first Architecture: Data is written and read directly from local storage, eliminating loading states and network dependency.
* Offline Mutability: Users can create, update, and delete notes while completely offline.
* Background Sync: An intelligent queue automatically syncs local mutations to the cloud upon reconnection.
* Real-time Collaboration: Changes from other devices are instantly broadcast and applied locally via WebSockets.
* Conflict Detection: Versioned records ensure that simultaneous edits are detected on the server without blindly overwriting data.
* Progressive Web App: Assets are cached via a Service Worker allowing full application load without internet access.

## Technology Stack

* Frontend: React.js, Tailwind CSS (Vite Build)
* Local Database: IndexedDB (via Dexie.js wrapper)
* Backend API: Node.js + Express.js
* Real-time Server: Socket.IO
* Cloud Database: MongoDB

## How to Run

1. Start the Backend Server

```bash
cd server
npm install
npm start
```

2. Start the Frontend Client

```bash
cd client
npm install
npm run dev
```

The app will be available at http://localhost:5173 and the API runs on port 3000.
