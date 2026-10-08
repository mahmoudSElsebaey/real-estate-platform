# Aqarco

Premium Real Estate, Resorts, Property Investment, Hotel & Apartment Booking Platform.

## Brand

**Aqarco** — Exceptional Living. Timeless Investment.

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
npm run seed
```

Demo password: `Demo@12345`

| Role | Email |
|------|-------|
| admin | admin@aqarco.demo |
| owner | owner@aqarco.demo |
| agent | agent@aqarco.demo |
| investor | investor@aqarco.demo |
| buyer | buyer@aqarco.demo |
| renter | renter@aqarco.demo |
| hotel_operator | hotel@aqarco.demo |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run seed` | Seed demo data |
