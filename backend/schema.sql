-- ================================================================
-- PRESSE MCNT — Schéma PostgreSQL v2.0
-- À importer dans pgAdmin : Tools > Query Tool > coller > Run (F5)
-- ================================================================

-- Nettoyage dans l'ordre (FK oblige)
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS categories    CASCADE;
DROP TABLE IF EXISTS users         CASCADE;

-- ──────────────────────────────────────────────────────────────
-- TABLE users  (remplace "authors" — contient admin ET auteurs)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            SERIAL       PRIMARY KEY,
  last_name     VARCHAR(100) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  profession    VARCHAR(150),
  cni_number    VARCHAR(50)  UNIQUE,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'author'
                             CHECK (role IN ('admin', 'author')),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- ──────────────────────────────────────────────────────────────
-- TABLE categories
-- ──────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE publications  (remplace l'ancienne — enrichie)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE publications (
  id           SERIAL       PRIMARY KEY,
  author_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  INTEGER      REFERENCES categories(id) ON DELETE SET NULL,
  title        VARCHAR(300) NOT NULL,
  content      TEXT         NOT NULL DEFAULT '',
  excerpt      TEXT         NOT NULL DEFAULT '',
  status       VARCHAR(20)  NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'pending', 'published')),
  published_at TIMESTAMPTZ,
  image_url    VARCHAR(500),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_publications_author   ON publications(author_id);
CREATE INDEX idx_publications_status   ON publications(status);
CREATE INDEX idx_publications_category ON publications(category_id);

-- ──────────────────────────────────────────────────────────────
-- TRIGGER : updated_at automatique
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_upd
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_publications_upd
  BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────────────────────
-- DONNÉES : Catégories initiales
-- ──────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug) VALUES
  ('Diabète',             'diabete'),
  ('Hypertension',        'hypertension'),
  ('Obésité',             'obesite'),
  ('Cancer',              'cancer'),
  ('Maladies cardiaques', 'maladies-cardiaques'),
  ('Général',             'general');
