# Instaa 📸

A full-stack Instagram-like social app with a **cinematic hero landing page**. No login required — just post and explore.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS 3 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Image Storage | ImageKit |
| Icons | Lucide React |

## Features

- 🎬 **Cinematic Hero Landing Page** — Full-screen video with custom JS fade system, liquid glass UI
- 📸 **Create Post** — Drag-and-drop image upload, caption, ImageKit storage
- 📰 **Feed** — All posts newest-first in masonry layout
- 🚫 No authentication needed

## Setup

### 1. Backend

```bash
cd backend
```

Edit `.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/instaa?retryWrites=true&w=majority
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Then start the backend:

```bash
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (newest first) |
| POST | `/api/posts` | Create a post (multipart/form-data: `image` + `caption`) |

## Getting Credentials

- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com) → Create cluster → Connect → Drivers
- **ImageKit**: [imagekit.io](https://imagekit.io) → Dashboard → Developers → API Keys
