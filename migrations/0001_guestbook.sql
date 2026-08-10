-- Guestbook signatures.
--
-- `approved` defaults to 1 so a signature appears straight away, which is what
-- makes the guestbook feel alive. To take one down, set it to 0:
--   wrangler d1 execute lucia-adams-guestbook --remote \
--     --command="UPDATE guestbook SET approved = 0 WHERE id = 12"

CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Hashed, never the raw address: only used for rate limiting.
  author_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_guestbook_visible
  ON guestbook (approved, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_guestbook_author
  ON guestbook (author_hash, created_at);
