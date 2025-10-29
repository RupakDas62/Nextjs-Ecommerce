# Next.js E-Commerce Catalog

## Setup & Run
1. Clone the repository
2. Run `npm install`
3. Add `.env` file (see `.env.example`)
4. Start the app:  `npm run dev`


The app runs on `http://localhost:3000`

## Rendering Strategies
- **Home Page (`/`)** → Static Site Generation (SSG)  
Fetches products at build time for fast loading.
- **Product Detail (`/products/[slug]`)** → Incremental Static Regeneration (ISR)  
Revalidates every 60 seconds for semi-dynamic data like prices.
- **Dashboard (`/dashboard`)** → Server-Side Rendering (SSR)  
Always fetches fresh inventory info from DB.
- **Admin Panel (`/admin`)** → Client-Side Rendering (CSR)  
Dynamic page for adding/updating products, using API calls.


# NextCommerce — Next.js + MongoDB Example

A small demo e-commerce catalog built with Next.js, Mongoose (MongoDB), JWT auth, and a tiny admin/dashboard UI to manage inventory. It demonstrates several rendering strategies (SSG + ISR and CSR), API routes, and middleware-based route protection.

## Quick Start

1. Install dependencies:
```powershell
npm install
```

2. Create a `.env` file at the project root. At minimum set:
- `MONGODB_URI` — MongoDB connection string (required)
- `MONGODB_DB` — optional DB name (defaults to `nextjs_ecom`)
- `JWT_SECRET` — secret used to sign JWT tokens (required)

You can copy `.env.example` if present and update it.

3. (Optional) Seed sample data:
```powershell
node scripts/seed.js
```

4. Run in development (port 3000):
```powershell
npm run dev
```

5. Build and run production:
```powershell
npm run build
npm start
```

Notes: scripts in `package.json`:
- `dev` → `next dev -p 3000`
- `build` → `next build`
- `start` → `next start -p 3000`

## Rendering strategy (per page)

- Home (`/`) — SSG (getStaticProps) with revalidate 3600
	- Implemented in `pages/index.js`. The page is statically generated at build time and revalidated hourly (`revalidate: 3600`) to keep product list reasonably fresh while keeping fast, cacheable pages.

- Product detail (`/products/[slug]`) — SSG with ISR
	- Implemented in `pages/products/[slug].js`. Uses `getStaticPaths` + `getStaticProps` with `fallback: 'blocking'` and `revalidate: 60`. This gives the performance of static pages while allowing new/updated products to appear with short revalidation (every 60s).

- Dashboard (`/dashboard`) — Client-side rendering (CSR)
	- Implemented in `pages/dashboard.js`. The page fetches product data from `/api/products` in a `useEffect` using an auth token stored in `localStorage`. CSR simplifies token handling and client-side redirects for this small admin/dashboard UI.

- Admin (`/admin`) — Client-side rendering (CSR)
	- Implemented in `pages/admin.js`. Admin UI uses client API calls for create/updates and requires an Authorization token (JWT) for protected operations.

- Auth pages (`/login`, `/signup`) — CSR
	- Implemented in `pages/login.js` and `pages/signup.js`. These pages post to API routes for authentication and then store tokens in `localStorage` and cookies.

Why these choices
- ISR for product pages balances performance and freshness (static output + short revalidate window).
- CSR for authenticated/admin pages keeps token handling and user flows simple (client stores token, middleware protects server-side routes via cookies for redirecting unauthenticated users).

## Authentication & API

- JWT utilities: `lib/auth.js`
	- `generateToken(user)` — signs a JWT with `{ id, role, name }` and expires in 1 day.
	- `verifyToken(req)` — reads `Authorization: Bearer <token>` header and verifies the token.

- API routes (key ones):
	- `GET /api/products` — public list of products (`pages/api/products/index.js`).
	- `POST /api/products` — create product (requires `Authorization: Bearer <token>`; token must decode to an admin role).
	- `GET /api/products/[id]` — get product by id.
	- `PUT /api/products/[id]` — update product (requires admin JWT).
	- `POST /api/auth/login` — login, returns `{ token, role, name }`.
	- `POST /api/auth/signup` — create a user.

Middleware
- `middleware.js` protects routes matching `/admin/:path*` and `/dashboard/:path*`. It checks cookies `token` and `role` and will redirect to `/login` if missing or if the role is not `admin` for admin pages.

## Database setup

1. Create a MongoDB instance (Atlas or a self-hosted MongoDB).
2. Create or copy a connection string and set `MONGODB_URI` in `.env` (and optionally `MONGODB_DB`).
3. The app connects using `lib/mongodb.js` (`connectDB`) and Mongoose models in `models/`:
	 - `models/Product.js` — product schema
	 - `models/User.js` — user schema
4. Optionally run the seed script to populate example products:
```powershell
node scripts/seed.js
```

Tip: If you use MongoDB Atlas, ensure your network access allows connections from your dev machine and that credentials in the connection string are correct.

## Environment variables (minimum)

- `MONGODB_URI` — required
- `MONGODB_DB` — optional (defaults to `nextjs_ecom`)
- `JWT_SECRET` — required for signing tokens

There may be other optional vars (e.g., `PORT`), but the above are required to run the project.

## Notable files

- `pages/index.js` — home page (SSG + ISR)
- `pages/products/[slug].js` — product detail (SSG + ISR, `getStaticPaths`)
- `pages/admin.js`, `pages/dashboard.js` — admin/dashboard (CSR)
- `pages/login.js`, `pages/signup.js` — auth forms (CSR)
- `pages/api/products/*` — product API endpoints
- `pages/api/auth/*` — auth endpoints
- `lib/mongodb.js` — Mongoose connection (`connectDB`)
- `lib/auth.js` — JWT helpers (`generateToken`, `verifyToken`)
- `middleware.js` — route protection for `/admin` and `/dashboard`
- `scripts/seed.js` — utility to seed example products

## 👨‍💻 Author

**Name:** Rupak Das  
**University:** University of Engineering and Management, Kolkata  
**Course:** B.Tech CSE (AI & ML)  
**Date:** October 29, 2025


## Troubleshooting

- If you see Mongo connection errors, verify `MONGODB_URI` and network access.
- If login fails, confirm `JWT_SECRET` is set and that the user exists (signup route creates users).

