# AJANS Flow

Ajans yönetim paneli: müşteri, iş/görev takibi, içerik takvimi, gelir-gider ve borç-alacak takibi.

Next.js (App Router) + Postgres (Neon). Vercel'e deploy edilmek üzere hazırlandı.

---

## Kullanıcılar ve yetkiler

| Kullanıcı | Rol | Başlangıç şifresi |
|---|---|---|
| `eren` | Yönetici | `eren1234` |
| `beyza` | Personel | `beyza1234` |
| `umit` | Personel | `umit1234` |
| `elif` | Personel | `elif1234` |

Herkes **ilk girişte kendi şifresini belirlemek zorunda**. Yönetici, Ayarlar
sayfasından herhangi bir kullanıcının şifresini sıfırlayabilir ve yeni kullanıcı
ekleyebilir.

**Yönetici** her şeyi görür. **Personel** yalnızca şunları görür:

- Görevler (kendisine atanmış veya kendi oluşturduğu)
- İçerik takvimi (kendisine atanmış paylaşımlar)
- Müşteriler (yalnızca kendisine atanmış olanlar; aylık ücret sütunu gizli)
- Ayarlar (yalnızca kendi şifresi)

Gelir/Gider, Borç & Alacak, Raporlar ve Hedefler sayfaları personelde menüde
görünmez; doğrudan adres yazılsa bile middleware ve sayfa içi `requireAdmin`
kontrolü engeller. Bu sayfaların sorguları personel için hiç çalışmaz, yani
finansal veri tarayıcıya hiç gönderilmez.

---

## Kurulum

### 1. Node.js
Node 20 veya üstü gerekiyor: <https://nodejs.org>

### 2. Paketler
```bash
npm install
```

### 3. Veritabanı (Neon)
1. <https://neon.tech> üzerinden ücretsiz bir proje açın (veya Vercel'de
   **Storage → Neon** ile bağlayın; bağlantı adresi otomatik gelir).
2. `.env.example` dosyasını `.env.local` olarak kopyalayın ve doldurun:

```bash
cp .env.example .env.local
```

`SESSION_SECRET` üretmek için:

```bash
openssl rand -base64 48
```

### 4. Tabloları ve kullanıcıları oluştur
```bash
npm run db:setup
```

### 5. Çalıştır
```bash
npm run dev
```

<http://localhost:3000>

---

## Vercel'e yayınlama

1. Projeyi bir GitHub deposuna gönderin.
2. Vercel'de **Add New → Project** ile depoyu içe aktarın.
3. **Settings → Environment Variables** altına ekleyin:
   - `DATABASE_URL`
   - `SESSION_SECRET`
4. Deploy edin.
5. İlk seferde tabloları oluşturmak için yerelde `.env.local` içinde üretim
   `DATABASE_URL`'i ile bir kez `npm run db:setup` çalıştırın.
6. `/api/health` adresi bağlantıyı doğrular: `{"ok":true,"kullanici":4}`

---

## Güvenlik notları

- Şifreler `bcrypt` ile (cost 12) hash'lenir, hiçbir yerde düz metin tutulmaz.
- Oturum, `httpOnly` + `sameSite=lax` çerezde imzalı JWT olarak taşınır;
  üretimde `secure` bayrağı açılır. Süre 12 saat.
- Şifre değişince `token_version` artar ve o kullanıcının diğer cihazlardaki
  oturumları düşer.
- Rol her istekte veritabanından okunur; çerezdeki role güvenilmez.
- Her server action kendi yetki kontrolünü yapar (`assertAdmin` / `assertUser`).
  Menüyü gizlemek koruma sayılmaz.
- Tüm SQL sorguları parametreli tagged template ile yazılır.

---

## Yapı

```
src/
  middleware.ts          oturum ve yönetici yolu kontrolü (ilk savunma)
  lib/
    db.ts                Neon bağlantısı
    auth.ts              oturum okuma, requireUser / requireAdmin
    session.ts           JWT imzalama ve doğrulama
    permissions.ts       menü ve yönetici yolları
    format.ts            para/tarih biçimleme, sabit listeler
  app/
    login/               giriş ekranı
    (app)/               korumalı sayfalar (sidebar'lı kabuk)
      page.tsx           pano
      gorevler/          iş takibi
      takvim/            içerik takvimi
      musteriler/        müşteriler
      finans/            gelir/gider          [yönetici]
      borclar/           borç & alacak        [yönetici]
      raporlar/          raporlar             [yönetici]
      hedefler/          hedefler             [yönetici]
      ayarlar/           şifre + kullanıcılar
db/schema.sql            tablo tanımları
scripts/setup-db.mjs     kurulum ve ilk kullanıcılar
```
