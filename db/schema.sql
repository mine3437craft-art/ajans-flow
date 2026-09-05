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

-- Bir goreve birden fazla kisi atanabilsin diye. tasks.assigned_to
-- "birincil" sorumluyu tutmaya devam eder (mevcut sorgular bozulmaz);
-- burasi "ayrica su kisiler de sorumlu" listesini tutar.
CREATE TABLE IF NOT EXISTS task_assignees (
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_task_assignees_user ON task_assignees(user_id);

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

-- ---------- Kasa (nakit/banka hesapları) ----------
-- "Nakit", "Garanti Bankası", "Akbank", "Annemin Garanti Hesabı" gibi
-- serbest isimli hesaplar. balance = guncel bakiye. Bir gelir/gider kaydi
-- veya transfer bu hesaba baglandiginda ayni SQL ifadesi icinde (CTE ile,
-- atomik olarak) artirilir/azaltilir; kayit silinince geri alinir. Elle de
-- duzeltilebilir -- banka ekstresiyle uyusmadiginda dogru rakam yazilir.
CREATE TABLE IF NOT EXISTS cash_accounts (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'banka' CHECK (account_type IN ('nakit', 'banka')),
  balance      NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes        TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

-- ---------- Kisi bazli sayfa yetkileri ----------
-- Varsayilan olarak "kasalar" (finans, borclar, raporlar, hedefler) sadece
-- yoneticiye acik. Yonetici, belirli bir personele belirli bir sayfayi
-- tek tek acabilir; bu tablo o istisnalari tutar. role='admin' zaten her
-- seyi gorur, bu tablo yalnizca 'staff' rolu icin anlam tasir.
CREATE TABLE IF NOT EXISTS user_page_access (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_key   TEXT NOT NULL CHECK (page_key IN ('finans', 'borclar', 'raporlar', 'hedefler')),
  granted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, page_key)
);

-- ---------- Kisayollar (Photoshop, Premiere vb.) ----------
-- Ekip icin ortak bilgi bankasi; herkes gorur, ekleyen ya da yonetici
-- silebilir. Tus kombinasyonu "+" ile ayrilmis parcalar olarak tutulur
-- (orn. "Ctrl+E") ki arayuzde ayri tuslar halinde gosterilebilsin.
CREATE TABLE IF NOT EXISTS shortcuts (
  id          SERIAL PRIMARY KEY,
  program     TEXT NOT NULL,
  keys        TEXT NOT NULL,
  aciklama    TEXT NOT NULL,
  author_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_shortcuts_program ON shortcuts(program);

-- ---------- Tekrarlayan gorev sablonlari ----------
-- Ornek: "Kok Cafe story" her Pazartesi ve Persembe.
-- Sablondan uretilen gorevler tasks tablosuna dusuruluyor.
CREATE TABLE IF NOT EXISTS task_templates (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  -- ISO gun numaralari: 1=Pazartesi ... 7=Pazar
  weekdays    SMALLINT[] NOT NULL DEFAULT '{}',
  priority    TEXT NOT NULL DEFAULT 'normal'
              CHECK (priority IN ('dusuk', 'normal', 'yuksek')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Uretilen gorev, kaynagini bilsin; ayni gun icin ikinci kez uretilmesin.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS template_id INTEGER
  REFERENCES task_templates(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_task_template_gun
  ON tasks(template_id, due_date) WHERE template_id IS NOT NULL;

-- ---------- Video deposu ----------
-- Musteri basina haftalik kac video paylasildigi customers.haftalik_video'da.
ALTER TABLE customers ADD COLUMN IF NOT EXISTS haftalik_video SMALLINT NOT NULL DEFAULT 0;
-- Bir sonraki ödemenin alınacağı tarih. Sözleşme bitişinden ayrı tutulur:
-- biri sözleşmenin süresini, diğeri bir sonraki tahsilatı gösterir.
ALTER TABLE customers ADD COLUMN IF NOT EXISTS next_payment_date DATE;
-- Müşterinin devam edip etmeyeceği belirsizse işaretlenir. Aylık Toplam
-- Gelir hesabından çıkarılır, ayrı bir "Olası Gelir" tutarında gösterilir.
ALTER TABLE customers ADD COLUMN IF NOT EXISTS renewal_uncertain BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS videos (
  id           SERIAL PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'depoda'
               CHECK (status IN ('depoda', 'yayinlandi', 'iptal')),
  recorded_on  DATE,
  published_on DATE,
  notes        TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_videos_musteri ON videos(customer_id, status);

-- ---------- Uygulama ayarlari ----------
-- SESSION_SECRET ortam degiskeni tanimli degilse, oturum anahtari burada
-- uretilip saklanir. Ortam degiskeni her zaman onceliklidir.
CREATE TABLE IF NOT EXISTS app_config (
  anahtar    TEXT PRIMARY KEY,
  deger      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- ---------- Kasa <-> Gelir/Gider baglantisi ----------
-- Her gelir/gider kaydi hangi kasadan (Nakit, Garanti, Akbank...) girdi/cikti
-- oldugunu tasir. NULL kalabilir: kasa secilmeden girilmis eski kayitlar ve
-- "hangi hesaptan odendigini bilmiyorum" durumu icin. Kasa silinirse kayit
-- durur, yalnizca bagi kopar.
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS account_id INTEGER
  REFERENCES cash_accounts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_tx_account ON transactions(account_id);

-- Hesaplar arasi para aktarimi: "Garanti'den nakit cektim" gibi. Gelir/gider
-- DEGILDIR; toplam varlik degismez, sadece yer degistirir. Bu yuzden ayri
-- tabloda tutulur, raporlardaki gelir/gider toplamlarini sismez.
CREATE TABLE IF NOT EXISTS cash_transfers (
  id              SERIAL PRIMARY KEY,
  from_account_id INTEGER NOT NULL REFERENCES cash_accounts(id) ON DELETE CASCADE,
  to_account_id   INTEGER NOT NULL REFERENCES cash_accounts(id) ON DELETE CASCADE,
  amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  occurred_on     DATE NOT NULL,
  description     TEXT,
  created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT transfer_ayni_hesap_olamaz CHECK (from_account_id <> to_account_id)
);
CREATE INDEX IF NOT EXISTS idx_transfer_tarih ON cash_transfers(occurred_on DESC);

-- ---------- Turkce arama ----------
-- Postgres'in ILIKE'i en_US kolasyonuyla calisiyor: lower('İ') iki kod
-- noktasina donusuyor, bu yuzden "İÇERİK" ILIKE '%içerik%' FALSE veriyordu.
-- Notlarin cogu buyuk harfle yazildigi icin arama hicbir seyi bulamiyordu.
-- Bu fonksiyon Turkce harfleri ASCII karsiligina katlar; hem buyuk/kucuk
-- harf hem de sapkasiz arama calisir ("SAĞDAKİ" <- "sagdaki").
-- Govdesinde ';' YOK: setup-db.mjs dosyayi ';' ile bolerek calistiriyor.
CREATE OR REPLACE FUNCTION tr_fold(t TEXT) RETURNS TEXT
  LANGUAGE SQL IMMUTABLE STRICT PARALLEL SAFE AS
$$ SELECT lower(translate(t, 'İIıŞşĞğÜüÖöÇç', 'iiissgguuoocc')) $$;

-- ---------- Duzenlenmis notlar (rehber) ----------
-- Ekibin ham notlari `notes` tablosunda oldugu gibi kalir. Burasi ayri:
-- ayni bilgi duzenlenmis, uzun ve dogrulanmis haliyle duruyor. Bir kayit
-- birden fazla ham nottan derlenmis olabilir (source_note_ids).
CREATE TABLE IF NOT EXISTS note_guides (
  id              SERIAL PRIMARY KEY,
  -- Tohumlama betigi tekrar calistiginda kayit cogalmasin diye.
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL DEFAULT 'Photoshop',
  icon            TEXT NOT NULL DEFAULT '📘',
  title           TEXT NOT NULL,
  summary         TEXT NOT NULL DEFAULT '',
  body            TEXT NOT NULL DEFAULT '',
  steps           TEXT[] NOT NULL DEFAULT '{}',
  tips            TEXT[] NOT NULL DEFAULT '{}',
  -- Sayfadaki gorsel anlatim bileseninin anahtari (RehberGorsel.tsx).
  visual          TEXT,
  source_note_ids INTEGER[] NOT NULL DEFAULT '{}',
  sort_order      INTEGER NOT NULL DEFAULT 100,
  author_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rehber_sira ON note_guides(category, sort_order);
