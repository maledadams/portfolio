-- Contact form submissions. Private: never rendered on the site, only read
-- via `wrangler d1 execute lucia-adams-guestbook --remote --command=...`.
--
-- Mark one as read once handled:
--   UPDATE messages SET read = 1 WHERE id = 12;

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  author_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_created ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_author ON messages (author_hash, created_at);
