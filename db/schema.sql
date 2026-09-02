-- =====================================================================
-- AJANS Flow - veritabani semasi (Postgres / Neon)
-- Calistirmak icin:  npm run db:setup
-- =====================================================================

-- ---------- Kullanicilar ----------
CREATE TABLE IF NOT EXISTS users (
  id                   SERIAL PRIMARY KEY,
  username             TEXT UNIQUE NOT NULL,
  display_name         TEXT NOT NULL,
  password_hash        TEXT NOT NULL,
  role                 TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  -- Sifre degisince artan sayac; eski oturum cerezlerini gecersiz kilar.
  token_version        INTEGER NOT NULL DEFAULT 0,
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Musteriler ----------
CREATE TABLE IF NOT EXISTS customers (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  company        TEXT,
  phone          TEXT,
  email          TEXT,
  package        TEXT NOT NULL DEFAULT 'Baslangic',
  monthly_fee    NUMERIC(12,2) NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'aktif'
                 CHECK (status IN ('aktif', 'duraklatildi', 'ayrildi')),
  start_date     DATE,
  contract_start DATE,
  contract_end   DATE,
  assigned_to    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_assigned ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_status   ON customers(status);

-- ---------- Gorevler (is takibi) ----------
CREATE TABLE IF NOT EXISTS tasks (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  customer_id  INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  assigned_to  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  due_date     DATE,
  due_time     TIME,
  priority     TEXT NOT NULL DEFAULT 'normal'
               CHECK (priority IN ('dusuk', 'normal', 'yuksek')),
  status       TEXT NOT NULL DEFAULT 'bekliyor'
               CHECK (status IN ('bekliyor', 'devam', 'tamamlandi', 'iptal')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due      ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);

-- ---------- Icerik takvimi ----------
CREATE TABLE IF NOT EXISTS content_posts (
  id           SERIAL PRIMARY KEY,
  customer_id  INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  platform     TEXT NOT NULL DEFAULT 'instagram',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status       TEXT NOT NULL DEFAULT 'planlandi'
               CHECK (status IN ('planlandi', 'hazir', 'yayinlandi', 'iptal')),
  assigned_to  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON content_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_posts_customer  ON content_posts(customer_id);

-- ---------- Gelir / Gider  [SADECE YONETICI] ----------
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('gelir', 'gider')),
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  category    TEXT NOT NULL,
  description TEXT,
  occurred_on DATE NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(occurred_on);
CREATE INDEX IF NOT EXISTS idx_tx_type ON transactions(type);

-- ---------- Borc / Alacak  [SADECE YONETICI] ----------
CREATE TABLE IF NOT EXISTS debts (
  id           SERIAL PRIMARY KEY,
  direction    TEXT NOT NULL CHECK (direction IN ('alacak', 'borc')),
  counterparty TEXT NOT NULL,
  customer_id  INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  paid_amount  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_date     DATE,
  description  TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT paid_not_over_amount CHECK (paid_amount <= amount)
);
CREATE INDEX IF NOT EXISTS idx_debts_due ON debts(due_date);

-- ---------- Hedefler  [SADECE YONETICI] ----------
CREATE TABLE IF NOT EXISTS goals (
  id     SERIAL PRIMARY KEY,
  period DATE NOT NULL,                    -- ilgili ayin 1'i
  metric TEXT NOT NULL CHECK (metric IN ('gelir', 'musteri', 'gorev')),
  target NUMERIC(12,2) NOT NULL CHECK (target > 0),
  UNIQUE (period, metric)
);

-- ---------- Notlar ----------
CREATE TABLE IF NOT EXISTS notes (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL DEFAULT '',
  -- ekip    : herkes gorur
  -- kisisel : yalnizca yazan gorur (yonetici dahil kimse goremez)
  visibility TEXT NOT NULL DEFAULT 'ekip' CHECK (visibility IN ('ekip', 'kisisel')),
  is_pinned  BOOLEAN NOT NULL DEFAULT FALSE,
  author_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notes_author  ON notes(author_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_at DESC);

-- ---------- Basarisiz giris denemeleri ----------
-- Kaba kuvvet denemelerini yavaslatmak icin. Basarili giriste temizlenir.
CREATE TABLE IF NOT EXISTS login_attempts (
  id         BIGSERIAL PRIMARY KEY,
  username   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attempts ON login_attempts(username, created_at DESC);

-- ---------- Islem gecmisi ----------
CREATE TABLE IF NOT EXISTS activity_log (
  id           BIGSERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,              -- ekle | guncelle | sil | giris
  entity       TEXT NOT NULL,              -- musteri | gorev | islem | borc ...
  entity_id    INTEGER,
  detail       TEXT,
  -- TRUE ise kayit finansal; personel gecmis ekraninda bunlar gizlenir.
  is_financial BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_log_created ON activity_log(created_at DESC);
