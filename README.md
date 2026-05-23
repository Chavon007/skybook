# SkyBook ✈️

A full-stack flight management web application where passengers can search and book flights, select seats, reschedule, and cancel bookings.

## Tech Stack

- **Frontend & API** — Next.js 16 (App Router)
- **Database & Auth** — Supabase (PostgreSQL + Supabase Auth + Realtime)
- **State Management** — Zustand with persist middleware
- **Styling** — Tailwind CSS
- **Animations** — Framer Motion

## Features

- User authentication (Email/Password + Google OAuth)
- Flight search by origin, destination, date and passenger count
- Interactive seat map with live availability via Supabase Realtime
- Seat selection supporting multiple passengers
- Passenger details collection
- Booking confirmation with PNR code generation
- My Bookings page with filter by status
- Reschedule booking with fee calculation
- Cancel booking (blocked within 2 hours of departure at DB level)
- Route protection — unauthenticated users redirected to login
- Fully responsive — mobile, tablet, desktop

## Live url
- https://skybook-sigma.vercel.app/

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Chavon007/skybook.git
cd skybook
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set up Supabase

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration files in order:
   - `supabase/migrations/001_create_tables.sql`
   - `supabase/migrations/002_enable_rls.sql`
   - `supabase/migrations/003_rpc_and_trigger.sql`
   - `supabase/migrations/004_seed.sql`
3. Go to **Authentication → Providers → Email** and enable Email provider
4. Go to **Database → Publications** and enable Realtime on the `seats` table

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Supabase Configuration

### Tables

- `flights` — flight details (route, time, price, status)
- `seats` — seat map per flight (class, availability, extra fee)
- `bookings` — user bookings with PNR code
- `passengers` — passenger details per booking
- `reschedules` — reschedule history

### Row Level Security

All tables have RLS enabled. Users can only access their own bookings, passengers and reschedules. Flights and seats are publicly readable.

### RPC Function

`reserve_seat` — atomic seat reservation that prevents double-booking race conditions using row-level locking.

### DB Trigger

`enforce_cancellation_window` — blocks cancellations within 2 hours of departure at the database level.

## Zustand Store Structure

### `useFlightStore`

Manages the entire booking flow state:

| State               | Type                | Description                                                  |
| ------------------- | ------------------- | ------------------------------------------------------------ |
| `searchQuery`       | `SearchQuery`       | Active search (origin, destination, date, passengers, class) |
| `flights`           | `Flight[]`          | Search results                                               |
| `selectedFlight`    | `Flight \| null`    | Flight chosen by user                                        |
| `seats`             | `Seat[]`            | Seats for selected flight                                    |
| `selectedSeat`      | `Seat[]`            | Seats chosen by user                                         |
| `passengersDetails` | `Passenger \| null` | Passenger form data                                          |
| `pnrCode`           | `string \| null`    | Generated PNR after booking                                  |

**Persist config** — only `searchQuery`, `selectedFlight`, `selectedSeat`, `pnrCode` and `passengersDetails` are persisted to localStorage. Raw flight and seat lists are not persisted.

### `useUserStore`

Manages authentication state:

| State     | Type              | Description           |
| --------- | ----------------- | --------------------- |
| `session` | `Session \| null` | Supabase auth session |

**Persist config** — only `access_token` and basic user info are persisted. Sensitive data is never stored in localStorage.

## Test Account

Email: testexample@gmail.com
Password: testaccount

## Routes

| Route | Page |
|---|---|
| `/` | Splash screen |
| `/login` | Login |
| `/signup` | Sign up |
| `/flight` | Flight search |
| `/result` | Search results |
| `/booking` | My bookings |
| `/booking/seat` | Seat selection |
| `/booking/details` | Passenger details |
| `/booking/confirmed` | Booking confirmation |
| `/booking/reschedule/[id]` | Reschedule booking |
| `/booking/cancelled/[id]` | Cancel booking |

## Trade-offs & What I Would Do Differently

- **Passport number security** — currently stored in Supabase `passengers` table. In production I would encrypt this field at rest.
- **Multiple passengers** — the current flow collects details for one passenger even when multiple seats are selected. I would add a passenger form per seat selected.
- **Payment integration** — the app generates a PNR and confirms booking without actual payment. I would integrate Paystack or Flutterwave for real payments.
- **Email notifications** — Supabase Auth sends signup emails but there are no booking confirmation emails. I would use Resend or Supabase Edge Functions to send booking receipts.
- **PWA** — did not complete the PWA bonus due to time constraints. I would configure `next-pwa` with a proper manifest, service worker caching strategy and offline fallback page.
- **Error boundaries** — the app handles errors at the hook level but does not have React error boundaries for unexpected crashes.
- **Testing** — no unit or integration tests were written. I would add Jest and React Testing Library for critical flows like booking and seat selection.