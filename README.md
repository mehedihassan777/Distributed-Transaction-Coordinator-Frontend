# Distributed Transaction Coordinator — Frontend

A high-performance **Next.js 16 (App Router)** frontend for the multi-tenant Distributed Transaction Coordinator .NET 8 API.

> If a user places an order, the inventory service reserves stock, and the payment service charges the card. If the payment fails, how do you reliably rollback the inventory without distributed locks? This dashboard lets you monitor and manage exactly that.

## Architecture overview

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router, React Server Components |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + custom Shadcn-style UI primitives |
| State / Hooks | Custom React hooks (`useTransactions`, `useProducts`, `useAuth`, `useDebounce`) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) toast library |
| Testing | Jest 30 + React Testing Library |

## Project structure

```
src/
├── app/
│   ├── layout.tsx                  # Root Server Component — Toaster, global CSS
│   ├── page.tsx                    # Redirects → /dashboard
│   └── (dashboard)/
│       ├── layout.tsx              # Shell: Sidebar + Header wrapper
│       ├── dashboard/page.tsx      # RSC — stats fetched server-side
│       ├── transactions/page.tsx   # Client table island
│       ├── products/page.tsx       # Client table island
│       └── settings/page.tsx
├── components/
│   ├── ui/                         # Button, Card, Badge, Input, Table, Skeleton, DataTable
│   └── layout/                     # Sidebar (collapsible), Header
├── features/
│   ├── dashboard/                  # StatsCard + StatsOverview (RSC)
│   ├── transactions/               # TransactionsTable + useTransactions hook
│   └── products/                   # ProductsTable + useProducts hook
├── hooks/
│   ├── use-auth.ts                 # JWT token management
│   └── use-debounce.ts             # Generic debounce hook
├── lib/
│   └── api/
│       ├── client.ts               # apiFetch with JWT injection + api.get/post/…
│       └── types.ts                # PaginatedResponse, ApiError, TableQueryParams
└── __tests__/
    └── components/
        └── data-table.test.tsx     # 20-test RTL suite for DataTable
```

## Fonts

The app uses a system font stack (`ui-sans-serif, system-ui, …`) defined in `src/app/globals.css`, requiring no external font service.

## Getting started

```bash
# Install dependencies
npm install

# Set your API base URL
echo 'NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api' > .env.local

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/dashboard`.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the .NET 8 API | `http://localhost:5000/api` |

## Testing

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

The test suite covers the `DataTable` component with 20 behaviour-focused tests: rendering, empty state, skeleton loaders, pagination, sorting, debounced search, and custom cell renderers.

## Authentication

JWT access tokens are stored in `localStorage` under the key `dtc_access_token`. The `apiFetch` utility reads the token automatically — client components via `localStorage`, server components via an HTTP-only cookie of the same name. Call `saveToken(token)` after a successful login and `clearToken()` on logout, or use the `useAuth()` hook.
