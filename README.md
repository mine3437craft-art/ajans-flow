# AJANS Flow

Ajans yönetim paneli: müşteri, iş/görev takibi, içerik takvimi, gelir-gider ve borç-alacak takibi.

Next.js (App Router) + Postgres. Vercel'e deploy edilmek üzere hazırlandı.

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
- Notlar (ekip notlarının tamamı + kendi kişisel notları)
- Ayarlar (yalnızca kendi şifresi)

### Notlar

Her notun görünürlüğü iki türlü olabilir:

- **Ekip** — herkes görür. Yazan kişi ve yönetici düzenleyip silebilir.
- **Sadece ben** — yalnızca yazan kişi görür. **Yönetici dahil kimse göremez.**
  Personele "sadece ben" diye sunulan bir notun patron tarafından okunabilir
  olması yanıltıcı olurdu; bu yüzden kural istisnasız uygulanıyor.

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

### 3. Ortam değişkenleri
```bash
cp .env.example .env.local
```

`SESSION_SECRET` üretmek için:

```bash
openssl rand -base64 48
```

### 4. Veritabanı

**Yerel geliştirme** — makinede çalışan gerçek bir Postgres, yönetici şifresi
gerekmez, veriler `.pgdata/` içinde:

```bash
npm run db:local
```

Bu süreç açık kaldığı sürece veritabanı ayaktadır (Ctrl+C ile düzgün kapanır).
`.env.local` içindeki `DATABASE_URL` varsayılan olarak buna bakar.

**Yayın** — Neon, Supabase veya başka bir Postgres sağlayıcısından aldığınız
bağlantı adresini `DATABASE_URL` olarak yazmanız yeterli; kodda değişiklik yok.

### 5. Tabloları ve kullanıcıları oluştur

Veritabanı ayaktayken, ayrı bir terminalde:

```bash
npm run db:setup
```

Tekrar çalıştırmak güvenlidir; var olan kullanıcılara dokunmaz.

### 6. Çalıştır
```bash
npm run dev
```

<http://localhost:3000>

---

## Vercel'e yayınlama

1. Projeyi bir GitHub deposuna gönderin.
2. Vercel'de **Add New → Project** ile depoyu içe aktarın.
3. **Settings → Environment Variables** altına iki değişken ekleyin —
   `Production` ortamı mutlaka işaretli olmalı:

   | Key | Değer |
   |---|---|
   | `DATABASE_URL` | Postgres bağlantı adresi, tırnaksız, sonunda `?sslmode=require` |
   | `SESSION_SECRET` | `openssl rand -base64 48` çıktısı — yereldekinden **farklı** olmalı (isteğe bağlı, aşağıya bakın) |

4. **Ortam değişkenleri çalışan deploy'a geriye dönük uygulanmaz.**
   Değişken ekledikten veya değiştirdikten sonra mutlaka yeni bir deploy alın:
   **Deployments → ⋯ → Redeploy**, ya da `main` dalına herhangi bir commit
   gönderin (Vercel her push'ta otomatik deploy alır).

5. Tabloları bir kez oluşturun: `.env.local` içine üretim `DATABASE_URL`'ini
   yazıp `npm run db:setup` çalıştırın.

6. `/api/health` adresi bağlantıyı doğrular:
   - `{"ok":true,"kullanici":4}` → her şey yolunda
   - `{"ok":false,"hata":"DATABASE_URL tanımlı değil..."}` → değişken eksik
     ya da eklendikten sonra yeni deploy alınmamış (4. adım)

---

## Güvenlik notları

- Şifreler `bcrypt` ile (cost 12) hash'lenir, hiçbir yerde düz metin tutulmaz.
- `SESSION_SECRET` tanımlıysa oturumlar onunla imzalanır. Tanımlı değilse
  uygulama ilk çalıştırmada rastgele bir anahtar üretip `app_config`
  tablosunda saklar — böylece tek bir eksik ortam değişkeni yüzünden giriş
  tamamen çalışmaz hale gelmez. Ortam değişkenini kullanmak yine de tercih
  edilir: anahtar o zaman veritabanının dışında kalır.
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
      notlar/            not defteri
      finans/            gelir/gider          [yönetici]
      borclar/           borç & alacak        [yönetici]
      raporlar/          raporlar             [yönetici]
      hedefler/          hedefler             [yönetici]
      ayarlar/           şifre + kullanıcılar
db/schema.sql            tablo tanımları
scripts/setup-db.mjs     kurulum ve ilk kullanıcılar
```
