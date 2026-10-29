# url-shortner

Monorepo for the URL shortener.

| Folder    | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `server/` | Bun + Express API with Postgres (Drizzle), Upstash Redis, and Kafka          |
| `client/` | TanStack Start + React frontend with auth, links, analytics, and QR codes   |

## Server

```bash
cd server
cp .env.example .env   # fill in the credentials
make up                # build and start the stack
```

The API runs at <http://localhost:3000>. See [server/README.md](server/README.md) for all make targets and details.

## Client

The frontend expects the backend to be running on port **3000**. Vite runs on **3001** and proxies `/api` to the backend so the auth cookie stays same-origin.

```bash
cd client
bun install
bun run dev            # http://localhost:3001
```

Set `API_PROXY_TARGET` if the backend is not at `http://localhost:3000`:

```bash
API_PROXY_TARGET=http://localhost:4000 bun run dev
```

See [client/README.md](client/README.md) for routes, API integration details, and the backend feature matrix.
