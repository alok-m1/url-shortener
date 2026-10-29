# url-shortner server

Backend for the url-shortner app. Run the commands below from this `server/`
directory.

Bun + Express URL shortener with Postgres (Drizzle), Upstash Redis caching, and
Kafka for click events.

## Docker

Copy the env file and fill in the Upstash Redis credentials:

```bash
cp .env.example .env
```

Build and start everything:

```bash
make up
```

| Service   | URL / port                                      |
| --------- | ----------------------------------------------- |
| app       | http://localhost:3000 (health: `/health`)       |
| Postgres  | `localhost:5434` (user/pass/db: `postgres`)     |
| Kafka     | `localhost:9092` (internal: `kafka:29092`)      |
| Kafka UI  | http://localhost:8080 with `make kafka-ui`      |
| Studio    | https://local.drizzle.studio?host=localhost:4983 with `make studio` |

### Make targets

Run `make` (or `make help`) to list every target.

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `make up`        | Build image and start the stack in the background |
| `make run`       | Start the stack in the foreground with logs        |
| `make down`      | Stop containers (keeps Postgres/Kafka data)        |
| `make stop`      | Stop one container (`make stop SERVICE=studio`)   |
| `make restart`   | `down` then `up`                                  |
| `make logs`      | Follow app logs (`make logs SERVICE=kafka`)       |
| `make ps`        | Show container status                             |
| `make shell`     | Shell into the app container                      |
| `make migrate`   | Run migrations in a one-off container             |
| `make kafka-ui`  | Start Kafka UI at http://localhost:8080           |
| `make studio`    | Start Drizzle Studio (browse the Postgres data)   |
| `make clean`     | Stop and remove the app image                     |
| `make wipe`      | Stop and delete app image, Postgres/Kafka data    |

The Dockerfile is multi-stage and installs production dependencies only, so the
runtime image stays small (~228 MB). Dev-only tooling (drizzle-kit, oxlint,
TypeScript) never reaches the final image. Build cache is removed in the same
layer it is created.

Migrations run in the one-shot `migrate` service using the same runtime image
(`src/db/migrate.ts`) before the app starts. The app runs with `bun --watch`,
and `src/` plus `env.ts` are bind-mounted, so edits reload without rebuilding.

### Reclaiming disk space

```bash
make clean        # stop + remove the app image (keep data)
make wipe         # stop + remove app image, Postgres data, Kafka data
docker builder prune -f   # delete image build cache
docker system df          # see where Docker space is going
```

Only run `docker system prune -a --volumes` if you want to wipe **every**
unused container, image, and volume on the machine, not just this project.

To include Kafka UI and Drizzle Studio:

```bash
make kafka-ui
make studio
```

Stop either of them without touching the rest of the stack:

```bash
make stop SERVICE=studio
make stop SERVICE=kafka-ui
make stop SERVICE="kafka-ui studio"   # both at once
```

`make down` still stops and removes everything, including these two.

`make studio` runs drizzle-kit in its own Bun container, pointed at the compose
Postgres instance (`postgres:5432`) — no local Bun install needed. It prints a
link to `https://local.drizzle.studio?host=localhost:4983`; open that and the
Studio UI connects to the local server on port 4983 to show the `users` and
`urls` tables. Deps live in a dedicated `studio-node-modules` volume, so your
host `node_modules` is left untouched.

Stop it with `make stop SERVICE=studio` (or `make down` for the whole stack).

### How Kafka is used

Each redirect publishes an event to the `url.clicks` topic (keyed by short code)
and returns immediately. A consumer in the same process increments
`urls.clicks`, so click counting is decoupled from the redirect path. If Kafka is
unreachable, the app still boots and clicks are written directly to Postgres.

## Local development (without Docker)

```bash
bun install
bun run db:migrate
bun run dev
```

## Scripts

```bash
bun run typecheck
bun run lint
bun run lint:fix
```
