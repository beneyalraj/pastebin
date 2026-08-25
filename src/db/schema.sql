CREATE TABLE IF NOT EXISTS pastes (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  max_views   INTEGER,
  view_count  INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_pastes_slug ON pastes (slug);