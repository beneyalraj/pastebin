# QuickPaste

> A minimal, fast, and open‑source Pastebin clone built with Node.js, Express, Neon PostgreSQL, and React.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)](https://neon.tech/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

---

## Features

- 📝 Create and share text pastes with a unique URL.
- ⏰ Optional expiration times (10 min, 1 hour, 24 hours, 7 days, or never).
- 👁️ Optional view limits – paste is deleted after N views.
- 📋 One‑click copy of shareable link and content.
- 🌐 Clean, dark‑themed, mobile‑responsive UI.
- 🚀 Deployed as a single project on Vercel (frontend + serverless API).

---

## Tech Stack

- **Backend**: Node.js, Express, `pg` (PostgreSQL client), `nanoid` for slugs.
- **Database**: [Neon](https://neon.tech/) – serverless PostgreSQL.
- **Frontend**: React, Vite, React Router, vanilla CSS.
- **Deployment**: Vercel (static frontend + serverless functions).

---

## Local Development Setup

### Prerequisites
- Node.js (>= 18.x)
- A Neon PostgreSQL database (free tier works)