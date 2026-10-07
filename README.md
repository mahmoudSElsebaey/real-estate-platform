# Aether Residences

Premium Real Estate, Resorts, Property Investment, Hotel & Apartment Booking Platform.

## Brand

**Aether Residences** — Exceptional Living. Timeless Investment.

Centralized brand configuration: `src/config/brand.config.ts`.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- next-intl (Arabic + English, RTL/LTR)
- MongoDB + Mongoose
- bcryptjs + jose (JWT sessions)
- Zod validation

## Getting Started

```bash
cp .env.example .env.local
# Set MONGODB_URI and AUTH_SECRET

npm install
npm run dev
```

Open http://localhost:3000

## Stage Status

### Stage 1 ✅
- Brand system, design tokens, i18n, Header, Footer, Hero, homepage

### Stage 2 ✅
- User model + MongoDB connection
- Register / Login / Logout APIs
- JWT httpOnly session cookies
- Profile page (view + edit)
- Role-based dashboard
- Auth UI (login + register) with full AR/EN support
- Header auth state awareness

## Roles

buyer · renter · investor · owner · agent · hotel_operator · admin
