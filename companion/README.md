# DopeStar Store Companion

A responsive Next.js companion for the existing DopeStar Store website. It includes a fit starting-point tool, a product style finder, and a Supabase-backed order tracker.

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project for order tracking

## Run locally

```bash
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_STORE_URL` to the public origin of the existing static website, for example `https://your-store-domain.example` (without a trailing slash). This enables the Store home, Shop, and Bag links.

For order tracking, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. These are server-side values; never rename the service-role key to a `NEXT_PUBLIC_` variable or commit `.env.local`.

Run the order-tracking migration in the Supabase SQL Editor:

```text
supabase/migrations/202611070001_order_tracking.sql
```

Start the development server:

```bash
npm run dev
```

In a separate terminal, validate the production build:

```bash
npm run build
```

## Order tracking operations

The current static checkout uses WhatsApp and does not create database orders. Until checkout is connected, staff creates an order in the Supabase Dashboard and shares its `tracking_code` with the customer. To add an order, create a row in `public.orders` with a unique `order_reference`; the database generates a private UUID tracking code. Update the row’s `status`, `status_note`, and optional `estimated_delivery` as the order progresses. Status changes automatically create timeline entries in `public.order_updates`.

Customer lookup is performed by a Next.js server route using the server-only Supabase service-role key. The browser never queries the Supabase tables directly. Row Level Security is enabled and anonymous/authenticated table access is revoked. Do not expose tracking codes publicly; anyone holding a code can view that order’s status.

## Connect the companion to the static website

After deploying this app, add a link to its production URL in the static site navigation (for example, `Style & Size` pointing to `/style-finder` or `/size-guide`). Set `NEXT_PUBLIC_STORE_URL` in the companion deployment so its Store home, Shop, and Bag links point back to `index.html`, `shop.html`, and `cart.html` on the static site. The current static site’s deployed origin was not included in the project files, so it must be supplied in that setting.

## Push to GitHub

The companion lives in the existing `neonmanhattan/DOPESTAR-STORE` repository under `companion/`. From the repository root, push the companion branch:

```bash
git switch add-dopestar-companion
git push -u origin add-dopestar-companion
```

Merge the branch into `main` when it is ready. Do not add `.env.local` or Supabase secrets to Git.

## Deploy to Vercel

### Vercel dashboard

1. Import the GitHub repository in Vercel.
2. Keep the framework preset as **Next.js** and set the project root directory to `companion`.
3. Add `NEXT_PUBLIC_STORE_URL`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` under **Settings → Environment Variables**. Use the existing static store origin for the first variable. Keep the service-role key private.
4. Deploy. Vercel runs the Next.js build from `companion/`; future pushes to the connected production branch deploy automatically.

### Vercel CLI

```bash
npm install
npm install --global vercel
vercel login
vercel
vercel env add NEXT_PUBLIC_STORE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel --prod
```

Run these commands from `companion/`. Paste each value when prompted. Also add the same variables for **Preview** if preview deployments should use live tracking. After production deploy, set the new Vercel URL as the companion destination in the static site’s navigation.
