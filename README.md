# 🔗 Linkvault — Frontend (React PWA)

> **Linkvault** is a personal, searchable bookmark vault. This is the **frontend** repository — a React-based Progressive Web App (PWA) that can be installed as a native app on Android and iOS.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 📱 Features

- **Register & Login** — JWT-based authentication with secure token storage
- **Profile Setup** — Pick from 8 emoji avatars, set a display name, and choose starter tags
- **Dashboard** — Full-width responsive layout with topbar, sidebar, and bookmark grid
- **Add Bookmarks** — Save URLs with title, description, and tags in a mobile-friendly modal (bottom sheet on mobile)
- **Real-time Search** — Filter across title, URL, description, and tags instantly
- **Tag Filtering** — Click any tag in the sidebar or on a card to filter the grid
- **Recently Added** — Auto-filter to bookmarks from the last 7 days
- **Favicon Auto-fetch** — Google Favicon API used for visual site identity
- **Copy Link** — One-click URL copy with visual confirmation
- **Delete Bookmarks** — Remove with confirmation prompt
- **PWA Install** — Add to Home Screen on Android (Chrome) and iOS (Safari) — runs standalone like a native app

---

## 🎨 Design

- **Dark glassmorphism UI** — `#0f0f1a` background, frosted glass cards
- **Custom color palette** — `primary` (indigo-violet), `accent` (teal, gold, coral)
- **Inter font** — Google Fonts for a premium feel
- **Micro-animations** — fade-in, slide-up, scale-in keyframes
- **Mobile-first** — responsive at every breakpoint, safe-area support for notched devices

---

## 🗂️ Project Structure

```
frontend/
├── public/
│   └── icons/             # PWA icons (192×192, 512×512)
└── src/
    ├── api/
    │   └── index.js        # Axios client + JWT interceptors + API helpers
    ├── context/
    │   └── AuthContext.jsx  # Auth state (user, token, login, logout)
    ├── pages/
    │   ├── Register.jsx
    │   ├── Login.jsx
    │   ├── ProfileSetup.jsx
    │   └── Dashboard.jsx
    ├── components/
    │   ├── Topbar.jsx       # Logo, search, add button, user dropdown
    │   ├── Sidebar.jsx      # Filters, tag list, add tag, mobile drawer
    │   ├── BookmarkCard.jsx # Card with favicon, tags, copy, delete
    │   └── AddBookmarkModal.jsx
    ├── utils/
    │   └── helpers.js       # Tag color hashing, date formatting, favicon URL
    ├── App.jsx              # Router with protected route logic
    ├── main.jsx
    └── index.css            # Tailwind + custom design tokens
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (see [link-vault-backend](https://github.com/hiravpatel/link-vault-backend))

### Install & Run

```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically — no CORS issues in development.

### Build for Production

```bash
npm run build
```

Output is in `dist/`. Deploy to **Vercel**, **Netlify**, or any static host.

---

## ⚙️ Environment / Proxy Config

The API proxy is configured in `vite.config.js`:
```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

For production, set the backend URL as an environment variable and update the Axios `baseURL` in `src/api/index.js`.

---

## 📲 PWA Installation

| Platform | Steps |
|----------|-------|
| **Android** (Chrome) | Tap the "Add to Home Screen" banner or use the browser menu |
| **iOS** (Safari) | Tap Share → "Add to Home Screen" |

The PWA uses **Workbox** (via `vite-plugin-pwa`) for cache-first asset serving and network-first API caching.

---

## 🔗 Related Repositories

- **Backend**: [link-vault-backend](https://github.com/hiravpatel/link-vault-backend) — Node.js + Express + MongoDB API

---

## 📄 License

MIT
