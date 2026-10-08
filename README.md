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
- Brand system, design tokens, i18n foundation, Header, Footer, Hero, homepage

### Stage 2 ✅
- User model + MongoDB connection
- Register / Login / Logout APIs
- JWT httpOnly session cookies
- Profile page (view + edit)
- Role-based dashboard
- Auth UI with full AR/EN support

### Stage 3 ✅
- Property model + bilingual fields + images
- CRUD APIs (create, list, get, update, archive)
- My Listings, New Property, Edit Property pages

### Stage 4 ✅
- Discover page with search, filters, sort, pagination
- PropertyCard component
- Property detail page with gallery
- Expanded public API filters

### Stage 5 ✅
- Favorite model + API
- FavoriteButton on cards and detail
- Favorites page
- Compare page (up to 4 properties)

### Stage 6 ✅
- Inquiry model + API
- InquiryForm on property detail
- My Requests page
- Owner Inbox with status updates

### Stage 7 ✅
- Booking model + API (mine / inbox)
- BookingForm on property detail (rent / hotel / resort)
- My Bookings page
- Owner booking inbox with status updates

### Stage 8 ✅
- Admin property moderation API
- Admin moderation page (filter, search, approve / reject / publish / suspend)

### Stage 9 ✅
- Investment opportunities listing API + page
- Investment Interest model + API
- InterestForm on investment properties
- My Interests + Owner investment inbox

### Stage 10 ✅
- Image upload API (`/api/upload`)
- ImageUploader component on New / Edit listing forms
- Local storage (dev) + Cloudinary support (production)

### Stage 11 ✅
- SEO helpers, metadataBase, Open Graph
- Dynamic sitemap + robots.txt
- Static pages: About, Contact, Help, Privacy, Terms, Careers

### Stage 12 ✅
- Demo seed script (`npm run seed`)
- 7 demo users (all roles)
- Published properties + one pending for moderation testing
- Login demo account picker support

## Roles

buyer · renter · investor · owner · agent · hotel_operator · admin

## Environment

See `.env.example`. Never commit secrets.

Required:
- `MONGODB_URI`
- `AUTH_SECRET` (min 32 chars)

Optional:
- `CLOUDINARY_*` for production image uploads
- `NEXT_PUBLIC_APP_URL`

## Demo seed

```bash
# requires MONGODB_URI in .env.local
npm run seed
```

Demo password for all accounts: `Demo@12345`

| Role | Email |
|------|-------|
| admin | admin@aether.demo |
| owner | owner@aether.demo |
| agent | agent@aether.demo |
| investor | investor@aether.demo |
| buyer | buyer@aether.demo |
| renter | renter@aether.demo |
| hotel_operator | hotel@aether.demo |

Seed creates published properties (sale, rent, invest, hotel) plus one pending listing for moderation testing.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Seed demo data |
