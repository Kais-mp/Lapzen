# Lapzen

Lapzen is a full-stack laptop and computer ecommerce store for customers in Pakistan. It combines a searchable product catalog, product-aware AI assistance, coupons, checkout, order management, content publishing, and an SEO-ready Next.js storefront.

Production site: [lapzen.shop](https://lapzen.shop)

## Highlights

- Product catalog with brand, series, category, search, variant, stock, image, and specification data.
- Product detail pages with pricing, variants, image lightbox, coupon validation, add-to-cart, and structured product data.
- Cart sidebar and checkout flows supporting Stripe payment intents, cash on delivery, and order-on-WhatsApp workflows.
- Customer accounts, authentication, password reset, order history, contact forms, and order confirmation email.
- AI laptop assistant powered by Groq and the live Supabase product catalog.
- Admin panel for inventory, sales orders, contacts, users, invitations, blog posts, popup ads, coupons, and settings.
- Responsive UI built with Tailwind CSS, Radix UI primitives, Framer Motion, and Lucide icons.
- Vercel Analytics, Google tag integration, Meta Pixel, and server-side Meta Conversions API tracking.

## Tech Stack

- **Application:** Next.js 15 App Router, React 19, TypeScript
- **Data and authentication:** Supabase SSR, Supabase JavaScript client, server-side service-role client
- **AI:** Groq SDK with `llama-3.3-70b-versatile`
- **Payments:** Stripe Payment Intents in PKR
- **Email:** Nodemailer with SMTP, defaulting to Brevo SMTP
- **UI:** Tailwind CSS, Radix UI, Framer Motion, React Hook Form, Zod
- **Observability and marketing:** Vercel Analytics, Google tag, Meta Pixel, Meta CAPI
- **Deployment:** Vercel-compatible Next.js server

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm (the examples below use npm)
- A Supabase project with the application tables and storage configured
- Provider accounts for any optional integrations you want to enable

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other available scripts are:

```bash
npm run build
npm run start
npm run lint
```

### Environment variables

Create `.env.local` in the project root. Keep service keys and API tokens server-only; only variables prefixed with `NEXT_PUBLIC_` are intended for the browser.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI assistant
GROQ_API_KEY=your-groq-api-key

# Stripe payments
STRIPE_SECRET_KEY=sk_test_or_live_key

# Meta Pixel and Conversions API
NEXT_PUBLIC_META_PIXEL_ID=your-pixel-id
META_ACCESS_TOKEN=your-meta-access-token

# Admin authentication
ADMIN_PASSWORD=your-admin-password

# Order email (optional but recommended)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SENDER_EMAIL=lapzen.store@gmail.com
SENDER_NAME=Lapzen

# Canonical site URL (useful for deployments and integrations)
NEXT_PUBLIC_SITE_URL=https://lapzen.shop
```

The SMTP integration gracefully skips delivery when SMTP credentials are absent, but payment, Supabase, Groq, and Meta credentials should be configured before enabling their respective workflows. The repository includes connection helpers such as `test-db.ts` and `check_schema.ts` for checking Supabase access and product columns. Database migrations are not included in this repository, so apply the required schema in your Supabase project before using the store.

## Storefront Features

### Catalog and discovery

- Homepage sections for featured products, new arrivals, brands, categories, popular series, FAQs, and blog posts.
- Catalog, search, brand, series, and collection routes for targeted browsing.
- Product pages generated from database records using slugified titles.
- Product cards and detail views expose pricing, specs, images, stock state, variants, and applicable coupons.
- Cart state is shared through the React cart context and presented in a global cart sidebar.

### Checkout and orders

- Stripe Payment Intent creation through `/api/create-payment-intent`, using PKR and a minimum amount of Rs. 150.
- Cash on delivery and order-on-WhatsApp options in addition to Stripe.
- Order creation and retrieval through `/api/orders`.
- Stripe webhook handling through `/api/webhooks` when configured.
- Order confirmation emails with item summaries, totals, payment method, delivery address, and support details.
- Purchase and content-view events can be sent to Meta Pixel and Meta CAPI.

### Coupons

Coupons can be attached to one or more products or applied globally. Supported discount types are percentage, fixed amount, and free shipping. Validation includes:

- Active status and start/expiry windows
- Minimum order amount
- Maximum discount amount for percentage coupons
- Total usage and per-user usage limits
- First-time-customer restrictions
- Product restrictions
- Per-user, per-email, and per-IP usage checks
- IP rate limiting for validation attempts

Successful uses are recorded by `/api/coupons/redeem`, allowing admin usage statistics and enforcement to remain server-side.

## AI Chatbot

The floating Lapzen Assistant is available throughout the storefront. The browser sends the conversation to `/api/chat`; the server then:

1. Loads up to 100 products from Supabase with IDs, prices, brands, series, specs, stock, and image URLs.
2. Adds that catalog to the Groq system prompt as the assistant's product context.
3. Instructs the model to respect budgets, answer in Pakistani Rupees, compare specifications, and explain when a requested product is unavailable.
4. Requires catalog recommendations to include `[PRODUCT_CARD:product-uuid]` markers.
5. Returns the response plus the matching product records.

The client parses those markers and renders compact, linked product cards with an image, title, price, RAM, and storage. Cards link to the canonical product slug, so recommendations lead directly into the shopping flow. A missing `GROQ_API_KEY` or unavailable catalog should be handled as an integration/configuration issue rather than solved by exposing provider credentials to the client.

## SEO and Discoverability

SEO is implemented at both the application and route level.

### Metadata

- Root metadata defines the canonical metadata base, title, description, Open Graph image, Twitter card, favicon, Apple icon, and web manifest.
- Important content pages define route-specific metadata where appropriate.
- Product, blog, and landing routes read database content server-side, making their titles and content crawlable without requiring client-side rendering.

### Structured data

The reusable `JsonLd` component emits JSON-LD for:

- Organization information, logo, social profiles, and customer support contact point
- WebSite and `SearchAction` markup
- Homepage and content page `WebPage` data
- Product offers and availability on product cards and product pages
- Collection, brand, series, blog, and FAQ-related page data where implemented

Keep JSON-LD values synchronized with the visible page content. Validate changes with Google's Rich Results Test and Schema Markup Validator.

### Automatic sitemap and feeds

- `/sitemap.xml` is generated dynamically by `src/app/sitemap.ts`.
- The sitemap includes static pages, active blog posts, products, brands, series, and categories derived from Supabase data.
- Sitemap generation is dynamic and revalidated hourly; product and blog timestamps are used as `lastModified` values.
- `/api/google-feed` generates an XML product feed with title, description, canonical product URL, images, PKR price, brand, MPN, availability, and Google product category.
- `public/robots.txt` and `public/sitemap.xml` are included as public crawl assets. Review the deployed sitemap URL after changes to the dynamic route.

### SEO best practices for content and data

- Use unique, descriptive product titles and stable slugs.
- Keep product descriptions, prices, stock, primary images, and structured data accurate.
- Use descriptive image URLs and alt text; provide a usable primary image for every product.
- Link new products and articles from crawlable catalog, brand, series, collection, or blog pages.
- Avoid publishing duplicate product URLs or thin placeholder pages.
- Treat the canonical domain as `https://lapzen.shop` in production and verify redirects, HTTPS, metadata, sitemap, and robots behavior after deployment.

## Analytics and Conversion Tracking

- `MetaPixel` loads the browser Pixel when `NEXT_PUBLIC_META_PIXEL_ID` is configured.
- `trackMetaEvent` sends browser events first, then forwards the event to `/api/meta-events` for server-side delivery.
- Meta CAPI hashes email and phone values with SHA-256 and forwards browser identifiers such as `_fbp` and `_fbc` when available.
- Checkout and product/search interactions use events such as `Purchase` and `ViewContent`.
- Google tag and Vercel Analytics are loaded from the root layout.

Do not commit access tokens. For production event quality, keep browser and server event names and payloads aligned, add stable event IDs when deduplicating, and test events in the Meta Events Manager.

## Admin Panel

Admin pages are under `/admin` and are protected by middleware. Unauthenticated requests are redirected to `/admin/login`; the session uses the `lapzen_admin_access` cookie.

Available management areas:

- **Dashboard:** high-level store statistics
- **Inventory:** create and update product records, images, variants, specs, pricing, and stock
- **Sales Orders:** review and manage customer orders
- **Contacts:** review submitted contact messages
- **Users:** inspect customer accounts
- **Invite Users:** create invitations for users
- **Blog Posts:** create, edit, publish, and deactivate SEO content
- **Popup Ads:** manage promotional popup content and active state
- **Coupons:** create, edit, activate, delete, and inspect coupon usage
- **Settings:** manage admin settings, including the admin password flow

The admin UI uses Supabase service-role routes for privileged operations. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or public client responses.

## API Routing

All handlers use the Next.js App Router convention under `src/app/api`.

| Route | Purpose |
| --- | --- |
| `/api/products` | Product listing, filters, and coupon-enriched catalog data |
| `/api/products/[slug]` | Product lookup by slug |
| `/api/products/variants` | Product variant data |
| `/api/chat` | Groq assistant with live catalog context |
| `/api/coupons/validate` | Validate a coupon and calculate its discount |
| `/api/coupons/redeem` | Record a successful coupon use |
| `/api/create-payment-intent` | Create a Stripe PKR Payment Intent |
| `/api/orders` | Create and retrieve orders |
| `/api/webhooks` | Payment/webhook processing |
| `/api/meta-events` | Forward browser events to Meta CAPI |
| `/api/google-feed` | Generate the Google Merchant XML feed |
| `/api/blog-posts` | Public blog post data |
| `/api/contact` | Contact form submission |
| `/api/send-email` | Email delivery endpoint |
| `/api/popup-ad` | Public popup advertisement data |
| `/api/auth/*` | Signup, email checks, and authentication helpers |
| `/api/admin/*` | Authenticated admin CRUD, stats, invitations, logout, and settings |

Validate request bodies, keep privileged Supabase calls server-side, rate-limit public mutation endpoints, and return appropriate HTTP status codes when adding new handlers.

## Project Structure

```text
src/app/                 App Router pages, metadata, sitemap, and API handlers
src/app/admin/           Protected administration screens
src/components/          Storefront components including cards, cart, chatbot, and schema
src/context/             Cart and UI contexts
src/lib/                 Supabase, payments, email, Meta, rate limiting, and utilities
public/                  Robots, sitemap, verification files, and static assets
```

## Deployment Checklist

1. Create the Supabase schema, policies, storage buckets, and seed product data.
2. Configure every required production environment variable in the hosting provider.
3. Set the canonical domain to `https://lapzen.shop` or update the hard-coded production URL values in sitemap/feed/schema code when deploying elsewhere.
4. Run `npm run build` and fix TypeScript or runtime configuration errors.
5. Verify `/`, `/products/<slug>`, `/sitemap.xml`, `/robots.txt`, and `/api/google-feed` in production.
6. Test signup/login, admin protection, coupon validation and redemption, each checkout method, webhooks, emails, chatbot cards, and Meta test events.
7. Confirm that service-role keys, Stripe secrets, SMTP passwords, Groq keys, and Meta tokens are not present in client bundles or logs.

## Support

- Phone and WhatsApp: `0309-0009022`
- Email: `lapzen.store@gmail.com`
- Website: [lapzen.shop](https://lapzen.shop)

## Contributing

1. Create a feature branch.
2. Make a focused change consistent with the existing App Router and Supabase patterns.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request with the behavior, data/schema impact, and verification steps documented.
