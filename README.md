# lucia-adams.com

Portfolio for Lucia Adams. Next.js on Cloudflare Workers, Spanish by default
with an English toggle, and a guestbook backed by D1.

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

The guestbook needs a local database once:

```bash
pnpm db:migrate:local
```

Signatures written locally live in `.wrangler/state` and are not shared.

## Going live on Cloudflare

The site is not deployed yet. Three steps, in order.

**1. Create the database.** This prints a `database_id`.

```bash
npx wrangler d1 create lucia-adams-guestbook
```

**2. Paste that id into `wrangler.jsonc`**, replacing
`REPLACE_WITH_ID_FROM_WRANGLER_D1_CREATE`. Nothing works until this is real.

**3. Create the table on the remote database, then deploy.**

```bash
pnpm db:migrate     # applies migrations/ to the real D1
pnpm deploy         # builds with OpenNext and uploads the Worker
```

`pnpm preview` runs the built Worker locally, which is closer to production
than `pnpm dev` and worth using before a deploy.

## Guestbook

Signatures publish immediately, because a guestbook that holds every note for
review does not feel like a guestbook. Protecting it:

- Name capped at 40 characters, message at 220.
- A honeypot field no human can see. Bots that fill it get a cheerful `200`
  and nothing is written.
- Three signatures per author per 24 hours. The author is identified by a
  SHA-256 hash of their IP salted with the current date, so it cannot be used
  to follow anyone across days.

To take a note down:

```bash
npx wrangler d1 execute lucia-adams-guestbook --remote \
  --command="UPDATE guestbook SET approved = 0 WHERE id = 12"
```

Only rows with `approved = 1` are shown. To review everything before it goes
public instead, change the column default in a new migration and flip rows to
`1` as you approve them.

If spam ever becomes a real problem, Turnstile is the next thing to add.

## Layout of the code

| Path | What lives there |
| --- | --- |
| `src/app/[locale]/` | The three pages: home, work, contact |
| `src/components/` | Nav, footer, guestbook, project card, motion helpers |
| `src/lib/guestbook.ts` | All D1 access and validation |
| `src/app/api/guestbook/` | The endpoint the sign form posts to |
| `messages/` | Every visible string, Spanish and English |
| `migrations/` | D1 schema |

Routes are localized: `/trabajo` and `/contacto` in Spanish, `/work` and
`/contact` in English, because the nav renders paths literally and the label
has to match the address.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Local dev with Cloudflare bindings |
| `pnpm build` | Next build (type checking included) |
| `pnpm lint` | ESLint |
| `pnpm preview` | Build and run the Worker locally |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm cf-typegen` | Regenerate binding types after editing `wrangler.jsonc` |
