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

### Stage 1
- Brand system, design tokens, i18n foundation, Header, Footer, Hero, homepage

### Stage 2
- User model + MongoDB connection
- Register / Login / Logout APIs
- JWT httpOnly session cookies
- Profile page (view + edit)
- Role-based dashboard
- Auth UI with full AR/EN support

### Stage 3
- Property model + bilingual fields + images
- CRUD APIs (create, list, get, update, archive)
- My Listings, New Property, Edit Property pages

### Stage 4
- Discover page with search, filters, sort, pagination
- PropertyCard component
- Property detail page with gallery
- Expanded public API filters

### Stage 5
- Favorite model + API
- FavoriteButton on cards and detail
- Favorites page
- Compare page (up to 4 properties)

### Stage 6
- Inquiry model + API
- InquiryForm on property detail
- My Requests page
- Owner Inbox with status updates

## Roles

buyer · renter · investor · owner · agent · hotel_operator · admin

## Environment

See `.env.example`. Never commit secrets.
