# knot. — frontend

A polished URL-shortener frontend built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui** (Base UI). Dark mode, light mode, and responsive layouts are included throughout.

The app is wired to the `server/` API via cookie-based auth. There is no mock data in the dashboard.

## Requirements

Start the backend first:

```bash
cd ../server
bun install
bun run db:migrate
bun run dev        # http://localhost:3000
```

Or use the Docker stack: `cd ../server && make up`.

## Routes

| Route                  | Page                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `/`                    | Marketing landing page; shortening requires a signed-in account   |
| `/login`               | Sign in with email + password                                     |
| `/signin`              | Alias that redirects to `/login`                                  |
| `/signup`              | Create account                                                    |
| `/dashboard`           | Real link portfolio: totals, clicks by link, recent links         |
| `/dashboard/links`     | Searchable, filterable, paginated links with delete + copy        |
| `/dashboard/analytics` | Lifetime clicks, links created, and rank by link                  |
| `/dashboard/qr-codes`  | Real scannable QR codes generated from each short URL             |
| `/dashboard/settings`  | Real account details, API connection, appearance, preferences     |

Routing uses TanStack Router's **directory-based** conventions:

```text
src/routes/
├── __root.tsx
├── index.tsx
├── login/route.tsx
├── signup/route.tsx
├── signin/route.tsx
├── dashboard/
│   ├── route.tsx
│   ├── index.tsx
│   ├── analytics/route.tsx
│   ├── links/route.tsx
│   ├── qr-codes/route.tsx
│   └── settings/route.tsx
```

## API connection

The frontend runs on **port 3001** and Vite proxies `/api` to the backend:

```ts
server: {
  port: 3001,
  proxy: {
    "/api": {
      target: process.env.API_PROXY_TARGET || "http://localhost:3000",
      changeOrigin: true,
    },
  },
}
```

- Requests use `credentials: "include"` in `src/lib/api.ts`.
- The backend's httpOnly auth cookie works because the proxy keeps the browser on the same origin.
- To point at a different backend port, set `API_PROXY_TARGET` before running Vite.
- For a production deployment, reverse-proxy `/api` to the backend (recommended) or set `VITE_API_BASE_URL` and enable CORS + credentialed cookies on the backend.
- Short links are returned by the API and point at the backend origin (`http://localhost:3000/<code>` locally).

## What the backend supports today

The UI only shows data the API actually provides:

- Auth: register, login, logout, current user
- Links: create (auto-generated short code), list, delete
- Clicks: aggregate count per link

It does **not** provide custom slugs, link status/pause, tags, click history over time, referrers, devices, countries, or QR scan counts. Those areas were removed or replaced with real derived totals instead of fake data.

## Other notes

- Charts are powered by [dither-kit](https://tripwire.sh/dither-kit) — ordered-dither fills, bloom, and tooltips. The kit lives in `src/components/dither-kit`.
- QR codes use `qrcode.react` and encode the real short URL.
- Theme is handled by `next-themes` with a pre-hydration script in `src/routes/__root.tsx`.
- Design tokens live in `src/styles.css`; shadcn components live in `src/components/ui`.

## Development

```bash
bun install
bun run dev        # http://localhost:3001
bun run typecheck
bun run lint
bun run build
```

## Adding more shadcn components

```bash
bunx shadcn@latest add <component>
```
