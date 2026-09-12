'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, assertAdmin, logActivity } from '@/lib/auth';
import {
  markaBul, digerMarka, DURUM_HARITA, gecerliDurum, gecerliUcDurum,
  sonrakiAramaTarihi, gunSonra, EK_ALANLAR, type Marka, type Durum, type UcDurum,
} from '@/lib/adaylar';
import { telefonCoz } from '@/lib/telefon';
import {
  ALANLAR, SATIR_SINIRI, ayracBul, hucreleriAyikla, otomatikEslestir, satirlariCevir,
  type AlanAnahtari, type Eslestirme,
} from '@/lib/aktarim';

function metin(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}
function bosNull(fd: FormData, key: string): string | null {
  const v = metin(fd, key);
  return v === '' ? null : v;
}
/** YYYY-AA-GG ve gerçekten var olan bir takvim günü mü? */
function tarihGecerli(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function sayi(fd: FormData, key: string): number | null {
  const v = metin(fd, key);
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isInteger(n) ? n : null;
}

/** Postgres tekil indeks ihlali. */
function ciftKayitMi(hata: unknown): boolean {
  return typeof hata === 'object' && hata !== null && (hata as { code?: string }).code === '23505';
}

function tazele(marka: Marka) {
  revalidatePath(`/musteri-bulma/${marka.yol}`);
  revalidatePath('/');
}

/**
 * Listeyi doğrular. Aday listeleri ekibin ortak işi: oturumu olan herkes
 * ekleyip arayabilir. Kalıcı silme ve Excel'e aktarma yöneticide kalır.
 */
async function listeErisimi(fd: FormData): Promise<Marka> {
  const marka = markaBul(metin(fd, 'marka'));
  if (!marka) throw new Error('Geçersiz liste.');
  await assertUser();
  return marka;
}

type AdaySatir = {
  id: number; brand: string; name: string; status: Durum;
  next_call_on: string | null; assigned_to: number | null;
  unreached_streak: number; call_count: number; last_note: string | null;
  last_call_at: string | null; last_call_by: number | null;
  has_website: UcDurum; worked_with_agency: UcDurum;
};

/**
 * Satır bazlı işlemler: markayı ASLA istemciden almıyoruz, kaydın
 * kendisinden okuyoruz. Böylece tek listeye yetkili biri, id uydurarak
 * diğer listenin kaydına dokunamaz.
 */
async function adayErisimi(id: number | null): Promise<{ marka: Marka; aday: AdaySatir }> {
  if (id === null) throw new Error('Geçersiz kayıt.');
  const rows = (await sql`
    SELECT id, brand, name, status, next_call_on, assigned_to, unreached_streak,
           call_count, last_note, last_call_at, last_call_by, has_website, worked_with_agency
    FROM prospects WHERE id = ${id}
  `) as AdaySatir[];
  const aday = rows[0];
  if (!aday) throw new Error('Kayıt bulunamadı.');
  const marka = markaBul(aday.brand);
  if (!marka) throw new Error('Kaydın listesi tanınmıyor.');
  await assertUser();
  return { marka, aday };
}

/** Aynı numara bu listede var mı — kullanıcıya nerede olduğunu söylemek için. */
async function ayniNumara(brand: string, norm: string, hariçId?: number) {
  const rows = (await sql`
    SELECT p.id, p.name, p.status, u.display_name AS sorumlu
    FROM prospects p
    LEFT JOIN users u ON u.id = p.assigned_to
    WHERE p.brand = ${brand} AND p.phone_norm = ${norm}
      AND (${hariçId ?? null}::bigint IS NULL OR p.id <> ${hariçId ?? null}::bigint)
    LIMIT 1
  `) as Array<{ id: number; name: string; status: string; sorumlu: string | null }>;
  return rows[0] ?? null;
}

/**
 * Diğer listede de kayıtlı mı. Kaydın ADI yalnızca o listeyi görme yetkisi
 * olana gösterilir; yetkisi olmayan yalnızca "var" bilgisini alır. Aksi
 * halde numara deneyerek göremediği listenin firma adları öğrenilebilirdi.
 */
async function digerListedeVar(
  marka: Marka, norm: string, digerErisim: boolean,
): Promise<string | null> {
  const diger = digerMarka(marka.anahtar);
  const rows = (await sql`
    SELECT name FROM prospects WHERE brand = ${diger.anahtar} AND phone_norm = ${norm} LIMIT 1
  `) as Array<{ name: string }>;
  if (rows.length === 0) return null;
  return digerErisim
    ? `Bu numara ${diger.ad} listesinde de var (${rows[0].name}).`
    : 'Bu numara diğer listede de kayıtlı.';
}

/**
 * Numara mevcut bir müşteriye mi ait? Personele müşteri adı GÖSTERİLMEZ —
 * yöneticinin "personel müşterilerimi görmesin" kuralı burada da geçerli.
 */
async function mevcutMusteriUyarisi(norm: string, yonetici: boolean): Promise<string | null> {
  const rows = (await sql`SELECT name, phone FROM customers WHERE phone IS NOT NULL`) as
    Array<{ name: string; phone: string }>;
  const eslesen = rows.find((r) => telefonCoz(r.phone).anahtar === norm);
  if (!eslesen) return null;
  return yonetici
    ? `Dikkat: bu numara mevcut müşteride kayıtlı (${eslesen.name}).`
    : 'Dikkat: bu numara mevcut bir müşteriye ait olabilir — Eren\'e sor.';
}

/* ---------------------------------------------------------------- ekleme */

export async function adayEkle(_prev: string | null, formData: FormData): Promise<string | null> {
  const marka = await listeErisimi(formData);
  const user = await assertUser();

  const ad = metin(formData, 'name');
  if (!ad) return 'Ad / firma zorunludur.';

  const hamTelefon = bosNull(formData, 'phone');
  const tel = telefonCoz(hamTelefon);

  if (tel.anahtar) {
    const mevcut = await ayniNumara(marka.anahtar, tel.anahtar);
    if (mevcut) {
      const d = DURUM_HARITA[mevcut.status]?.ad ?? mevcut.status;
      return `Bu numara zaten listede: ${mevcut.name} · ${d}`
        + `${mevcut.sorumlu ? ` · Sorumlu: ${mevcut.sorumlu}` : ''}`;
    }
  }

  const not = bosNull(formData, 'note');
  let rows: Array<{ id: number }>;
  try {
    rows = (await sql`
      INSERT INTO prospects
        (brand, name, contact_person, phone_raw, phone_norm, phone_kind, city, source, link,
         has_website, worked_with_agency, assigned_to, last_note, created_by)
      VALUES (${marka.anahtar}, ${ad}, ${bosNull(formData, 'contact_person')},
              ${hamTelefon}, ${tel.anahtar}, ${tel.tur},
              ${bosNull(formData, 'city')}, ${bosNull(formData, 'source')}, ${bosNull(formData, 'link')},
              ${gecerliUcDurum(metin(formData, 'has_website')) ? metin(formData, 'has_website') : 'bilinmiyor'},
              ${gecerliUcDurum(metin(formData, 'worked_with_agency')) ? metin(formData, 'worked_with_agency') : 'bilinmiyor'},
              ${sayi(formData, 'assigned_to')}, ${not}, ${user.id})
      RETURNING id
    `) as Array<{ id: number }>;
  } catch (hata) {
    if (ciftKayitMi(hata)) return 'Bu numara zaten listede.';
    throw hata;
  }

  const id = rows[0]?.id;
  if (not && id) {
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
      VALUES (${id}, ${marka.anahtar}, ${user.id}, 'not', ${not})
    `;
  }

  const uyarilar: string[] = [];
  if (!tel.gecerli && hamTelefon) uyarilar.push('Numara anlaşılamadı, kontrol et.');
  if (tel.anahtar) {
    // İki liste de herkese açık olduğu için diğer listedeki kaydın adı
    // gösterilebilir. Mevcut MÜŞTERİ adı hâlâ yalnızca yöneticiye görünür.
    const d = await digerListedeVar(marka, tel.anahtar, true);
    if (d) uyarilar.push(d);
    const m = await mevcutMusteriUyarisi(tel.anahtar, user.role === 'admin');
    if (m) uyarilar.push(m);
  }

  await logActivity({ userId: user.id, action: 'ekle', entity: 'aday', entityId: id, detail: `${marka.ad} — ${ad}` });
  tazele(marka);
  return `ok|${id}|${uyarilar.join(' ')}`;
}

/* ------------------------------------------------------------ düzenleme */

export async function adayGuncelle(_prev: string | null, formData: FormData): Promise<string | null> {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();

  const ad = metin(formData, 'name');
  if (!ad) return 'Ad / firma zorunludur.';

  const hamTelefon = bosNull(formData, 'phone');
  const tel = telefonCoz(hamTelefon);
  if (tel.anahtar) {
    const mevcut = await ayniNumara(marka.anahtar, tel.anahtar, aday.id);
    if (mevcut) return `Bu numara listede başka bir kayıtta: ${mevcut.name}`;
  }

  try {
    await sql`
      UPDATE prospects SET
        name = ${ad}, contact_person = ${bosNull(formData, 'contact_person')},
        phone_raw = ${hamTelefon}, phone_norm = ${tel.anahtar}, phone_kind = ${tel.tur},
        city = ${bosNull(formData, 'city')}, source = ${bosNull(formData, 'source')},
        link = ${bosNull(formData, 'link')},
        has_website = ${gecerliUcDurum(metin(formData, 'has_website')) ? metin(formData, 'has_website') : aday.has_website},
        worked_with_agency = ${gecerliUcDurum(metin(formData, 'worked_with_agency')) ? metin(formData, 'worked_with_agency') : aday.worked_with_agency},
        updated_at = NOW()
      WHERE id = ${aday.id}
    `;
  } catch (hata) {
    if (ciftKayitMi(hata)) return 'Bu numara listede başka bir kayıtta.';
    throw hata;
  }

  await logActivity({ userId: user.id, action: 'güncelle', entity: 'aday', entityId: aday.id, detail: ad });
  tazele(marka);
  return `ok|${aday.id}|`;
}

/**
 * Tablodan yapılan tek alan değişikliği (durum, tekrar arama tarihi,
 * sorumlu, web sitesi, ajans geçmişi). 'durum' türünde olay yazar —
 * arama SAYILMAZ, çünkü bu bir düzeltme, temas değil.
 */
export async function alanGuncelle(formData: FormData) {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();

  const alan = metin(formData, 'alan');
  const deger = metin(formData, 'deger');
  const prev = {
    status: aday.status, next_call_on: aday.next_call_on, assigned_to: aday.assigned_to,
    unreached_streak: aday.unreached_streak, call_count: aday.call_count,
    last_note: aday.last_note, last_call_at: aday.last_call_at, last_call_by: aday.last_call_by,
    has_website: aday.has_website, worked_with_agency: aday.worked_with_agency,
  };

  if (alan === 'durum') {
    if (!gecerliDurum(deger)) throw new Error('Geçersiz durum.');
    const tanim = DURUM_HARITA[deger];
    // Kapanan durumlarda tekrar arama tarihi anlamsız, temizlenir.
    const tarih = tanim.acik ? aday.next_call_on : null;
    await sql`
      UPDATE prospects SET status = ${deger}, next_call_on = ${tarih}, updated_at = NOW()
      WHERE id = ${aday.id}
    `;
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, status_before, status_after, next_call_on, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'durum', ${aday.status}, ${deger}, ${tarih}, ${JSON.stringify(prev)}::jsonb)
    `;
  } else if (alan === 'tarih') {
    const tarih = tarihGecerli(deger) ? deger : null;
    await sql`UPDATE prospects SET next_call_on = ${tarih}, updated_at = NOW() WHERE id = ${aday.id}`;
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, next_call_on, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'durum', ${tarih}, ${JSON.stringify(prev)}::jsonb)
    `;
  } else if (alan === 'sorumlu') {
    const kisi = deger === '' ? null : parseInt(deger, 10);
    if (kisi !== null && !Number.isInteger(kisi)) throw new Error('Geçersiz kişi.');
    if (kisi !== null) {
      const uygun = (await sql`
        SELECT 1 FROM users WHERE id = ${kisi} AND is_active
      `) as unknown[];
      if (uygun.length === 0) throw new Error('Kullanıcı bulunamadı.');
    }
    await sql`UPDATE prospects SET assigned_to = ${kisi}, updated_at = NOW() WHERE id = ${aday.id}`;
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'durum', ${JSON.stringify(prev)}::jsonb)
    `;
  } else if (alan === 'web' || alan === 'ajans') {
    if (!gecerliUcDurum(deger)) throw new Error('Geçersiz değer.');
    if (!marka.ekAlanlar.includes(alan)) throw new Error('Bu alan bu listede kullanılmıyor.');
    const sutun = EK_ALANLAR[alan].sutun;
    if (sutun === 'has_website') {
      await sql`UPDATE prospects SET has_website = ${deger}, updated_at = NOW() WHERE id = ${aday.id}`;
    } else {
      await sql`UPDATE prospects SET worked_with_agency = ${deger}, updated_at = NOW() WHERE id = ${aday.id}`;
    }
    // Olay kaydı şart: yazılmazsa bu değişiklik geçmişte görünmez ve daha
    // önceki olay "en son olay" kalıp "Geri al" bunu sessizce geri alır.
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'durum',
              ${`${EK_ALANLAR[alan].baslik}: ${EK_ALANLAR[alan].etiket[deger].uzun}`},
              ${JSON.stringify(prev)}::jsonb)
    `;
  } else {
    throw new Error('Geçersiz alan.');
  }

  tazele(marka);
}

/** Yalnızca not ekler; durumu ve arama sayısını değiştirmez. */
export async function notEkle(formData: FormData) {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();

  const not = metin(formData, 'note');
  if (!not) return;

  await sql`
    UPDATE prospects SET last_note = ${not}, updated_at = NOW() WHERE id = ${aday.id}
  `;
  await sql`
    INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
    VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'not', ${not})
  `;
  tazele(marka);
}

/* --------------------------------------------------------- arama sonucu */

/** "Tekrar ara" seçimini tarihe çevirir. */
function tarihSecimi(secim: string, elle: string, durum: Durum, seri: number): string | null {
  if (secim === 'yok') return null;
  if (secim === 'yarin') return gunSonra(1);
  if (secim === '3gun') return gunSonra(3);
  if (secim === '1hafta') return gunSonra(7);
  if (secim === 'secili') return tarihGecerli(elle) ? elle : null;
  return sonrakiAramaTarihi(durum, seri); // 'otomatik'
}

/**
 * Bir arama sonucunu kaydeder. Tek SQL ifadesinde: geçmişe olay yazılır ve
 * kaydın özeti güncellenir — yarım kalmış kayıt oluşamaz. Sahibi olmayan
 * adayda ilk temas eden kişi sorumlu olur, böylece geri aramalar sahipsiz
 * kalmaz.
 */
export async function sonucKaydet(formData: FormData) {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();

  const durum = metin(formData, 'durum');
  if (!gecerliDurum(durum) || durum === 'aranmadi') throw new Error('Geçersiz sonuç.');

  const kanal = metin(formData, 'kanal') === 'whatsapp' ? 'whatsapp' : 'telefon';
  const not = bosNull(formData, 'note');
  const tarih = tarihSecimi(metin(formData, 'tarih_secim') || 'otomatik',
    metin(formData, 'tarih'), durum, aday.unreached_streak);

  const web = gecerliUcDurum(metin(formData, 'web')) ? metin(formData, 'web') : null;
  const ajans = gecerliUcDurum(metin(formData, 'ajans')) ? metin(formData, 'ajans') : null;

  const prev = {
    status: aday.status, next_call_on: aday.next_call_on, assigned_to: aday.assigned_to,
    unreached_streak: aday.unreached_streak, call_count: aday.call_count,
    last_note: aday.last_note, last_call_at: aday.last_call_at, last_call_by: aday.last_call_by,
    has_website: aday.has_website, worked_with_agency: aday.worked_with_agency,
  };

  const rows = (await sql`
    WITH olay AS (
      INSERT INTO prospect_events
        (prospect_id, brand, user_id, kind, channel, status_before, status_after, next_call_on, note, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'arama', ${kanal},
              ${aday.status}, ${durum}, ${tarih}, ${not}, ${JSON.stringify(prev)}::jsonb)
      RETURNING id
    ),
    guncel AS (
      UPDATE prospects SET
        status = ${durum},
        next_call_on = ${tarih},
        call_count = call_count + 1,
        unreached_streak = CASE WHEN ${durum} = 'ulasilamadi' THEN unreached_streak + 1 ELSE 0 END,
        last_call_at = NOW(),
        last_call_by = ${user.id},
        last_note = COALESCE(${not}, last_note),
        assigned_to = COALESCE(assigned_to, ${user.id}),
        has_website = COALESCE(${web}, has_website),
        worked_with_agency = COALESCE(${ajans}, worked_with_agency),
        updated_at = NOW()
      WHERE id = ${aday.id}
      RETURNING name
    )
    SELECT olay.id AS olay_id, guncel.name AS ad FROM olay, guncel
  `) as Array<{ olay_id: number; ad: string }>;

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'aday arama', entityId: aday.id,
    detail: `${rows[0]?.ad ?? aday.name} — ${DURUM_HARITA[durum].ad}`,
  });
  tazele(marka);
}

/**
 * Son kaydı geri alır: yalnızca kendi yazdığın, yalnızca o adayın EN SON
 * olayı ve yalnızca 15 dakika içinde. Telefonda yanlış düğmeye basmak
 * kalıcı hasar vermesin diye.
 */
export async function geriAl(formData: FormData) {
  const olayId = sayi(formData, 'olay_id');
  if (olayId === null) throw new Error('Geçersiz kayıt.');
  const user = await assertUser();

  const sahip = (await sql`
    SELECT prospect_id, brand FROM prospect_events WHERE id = ${olayId}
  `) as Array<{ prospect_id: number; brand: string }>;
  if (!sahip[0]) throw new Error('Kayıt bulunamadı.');
  const marka = markaBul(sahip[0].brand);
  if (!marka) throw new Error('Liste tanınmıyor.');
  await assertUser();

  await sql`
    WITH hedef AS (
      SELECT e.id, e.prospect_id, e.prev
      FROM prospect_events e
      WHERE e.id = ${olayId}
        AND e.user_id = ${user.id}
        AND e.prev IS NOT NULL
        AND e.created_at > NOW() - INTERVAL '15 minutes'
        AND NOT EXISTS (
          SELECT 1 FROM prospect_events y WHERE y.prospect_id = e.prospect_id AND y.id > e.id
        )
    ),
    geri AS (
      UPDATE prospects p SET
        status = COALESCE(h.prev->>'status', p.status),
        next_call_on = NULLIF(h.prev->>'next_call_on', '')::date,
        assigned_to = NULLIF(h.prev->>'assigned_to', '')::int,
        unreached_streak = COALESCE(NULLIF(h.prev->>'unreached_streak', '')::int, 0),
        call_count = COALESCE(NULLIF(h.prev->>'call_count', '')::int, 0),
        last_note = h.prev->>'last_note',
        last_call_at = NULLIF(h.prev->>'last_call_at', '')::timestamptz,
        last_call_by = NULLIF(h.prev->>'last_call_by', '')::int,
        has_website = COALESCE(h.prev->>'has_website', p.has_website),
        worked_with_agency = COALESCE(h.prev->>'worked_with_agency', p.worked_with_agency),
        updated_at = NOW()
      FROM hedef h WHERE p.id = h.prospect_id
      RETURNING p.id
    )
    DELETE FROM prospect_events WHERE id IN (SELECT id FROM hedef)
  `;

  tazele(marka);
}

/* ----------------------------------------------------------------- silme */

/** Kalıcı silme yalnızca yöneticide — liste yetkisi silme yetkisi değil. */
export async function adaySil(formData: FormData) {
  const admin = await assertAdmin();
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);

  await sql`DELETE FROM prospects WHERE id = ${aday.id}`;
  await logActivity({
    userId: admin.id, action: 'sil', entity: 'aday', entityId: aday.id,
    detail: `${marka.ad} — ${aday.name}`,
  });
  tazele(marka);
}

/* ------------------------------------------------------------ içe aktarma */


export type AktarimOzet = {
  eklenecek: number; zatenVar: number; dosyadaTekrar: number;
  adsiz: number; numarasiz: number; numaraGecersiz: number; digerListede: number;
};

export type AktarimSonuc =
  /** `metin` dolu gelirse istemci önizleme ekranında kalır; kullanıcının
   *  yapıştırdığı liste hata yüzünden kaybolmasın. */
  | { durum: 'hata'; mesaj: string; metin?: string }
  | {
      durum: 'onizleme'; metin: string; baslikVar: boolean; eslesme: Eslestirme;
      basliklar: string[]; ornek: Array<Record<string, string>>; ozet: AktarimOzet;
      /** İlk adımda girilen değerler: ikinci adımda kaybolmasın. */
      kaynak: string; sorumlu: string;
    }
  | { durum: 'bitti'; eklenen: number; atlanan: number; parti: string };

/** Yapıştırılan metni çözüp kayıtlara ve özete çevirir. */
async function aktarimiHazirla(marka: Marka, formData: FormData) {
  const ham = String(formData.get('metin') ?? '');
  const ayrac = ayracBul(ham);
  const hucreler = hucreleriAyikla(ham, ayrac);
  if (hucreler.length === 0) return null;

  const otomatik = otomatikEslestir(hucreler);
  const sutunSayisi = Math.max(0, ...hucreler.map((h) => h.length));

  // Önizlemeden gelen eşleştirme: alan_0, alan_1 … form alanları. Hiç
  // gönderilmediyse (ilk adım) sunucunun tahmini kullanılır.
  const gecerliAlanlar = new Set<string>(ALANLAR.map((a) => a.anahtar));
  const elleVar = Array.from({ length: sutunSayisi }, (_, i) => formData.has(`alan_${i}`)).some(Boolean);
  const eslesme: Eslestirme = elleVar
    ? Array.from({ length: sutunSayisi }, (_, i) => {
        const v = String(formData.get(`alan_${i}`) ?? '');
        return gecerliAlanlar.has(v) ? (v as AlanAnahtari) : null;
      })
    : otomatik.eslesme;

  // Onay kutusu: işaretsizse form alanı hiç gelmez. İlk adımda kutu yok,
  // o yüzden "eşleştirme geldi mi" bilgisine bakıyoruz.
  const baslikVar = elleVar ? formData.has('baslik_var') : otomatik.baslikVar;

  const kayitlar = satirlariCevir(hucreler, eslesme, baslikVar).slice(0, SATIR_SINIRI);
  const kaynak = bosNull(formData, 'kaynak');

  // Bu listede ve diğer listede var olan numaralar
  const mevcut = (await sql`
    SELECT phone_norm, brand FROM prospects WHERE phone_norm IS NOT NULL
  `) as Array<{ phone_norm: string; brand: string }>;
  const buListe = new Set(mevcut.filter((m) => m.brand === marka.anahtar).map((m) => m.phone_norm));
  const digerListe = new Set(mevcut.filter((m) => m.brand !== marka.anahtar).map((m) => m.phone_norm));

  const ozet: AktarimOzet = {
    eklenecek: 0, zatenVar: 0, dosyadaTekrar: 0,
    adsiz: 0, numarasiz: 0, numaraGecersiz: 0, digerListede: 0,
  };
  const gorulen = new Set<string>();
  const eklenecekler: Array<{
    ad: string; yetkili: string | null; hamTel: string | null; norm: string | null;
    tur: string; sehir: string | null; kaynak: string | null; link: string | null; not: string | null;
    durumEtiket: string;
  }> = [];

  for (const k of kayitlar) {
    const ad = (k.name ?? '').trim();
    const hamTel = (k.phone ?? '').trim() || null;
    const tel = telefonCoz(hamTel);

    if (!ad && !hamTel) { ozet.adsiz++; continue; }
    // Adı olmayan ama numarası olan satır: numarayı ad yerine koyuyoruz ki
    // kayıt kaybolmasın, kullanıcı sonra düzeltir.
    const adSon = ad || tel.gorunum || 'İsimsiz';
    if (!ad) ozet.adsiz++;
    if (!hamTel) ozet.numarasiz++;
    else if (!tel.gecerli) ozet.numaraGecersiz++;

    let etiket = 'Eklenecek';
    if (tel.anahtar) {
      if (gorulen.has(tel.anahtar)) { ozet.dosyadaTekrar++; etiket = 'Listede tekrar'; }
      else if (buListe.has(tel.anahtar)) { ozet.zatenVar++; etiket = 'Zaten listede'; }
      gorulen.add(tel.anahtar);
      if (digerListe.has(tel.anahtar)) ozet.digerListede++;
    }
    if (etiket === 'Eklenecek') ozet.eklenecek++;
    if (!tel.gecerli && hamTel) etiket = etiket === 'Eklenecek' ? 'Numara hatalı — yine eklenir' : etiket;

    eklenecekler.push({
      ad: adSon, yetkili: (k.contact_person ?? '').trim() || null,
      hamTel, norm: tel.anahtar, tur: tel.tur,
      sehir: (k.city ?? '').trim() || null,
      kaynak: (k.source ?? '').trim() || kaynak,
      link: (k.link ?? '').trim() || null,
      not: (k.note ?? '').trim() || null,
      durumEtiket: etiket,
    });
  }

  return { hucreler, eslesme, baslikVar, eklenecekler, ozet };
}

export async function iceAktar(
  _prev: AktarimSonuc | null, formData: FormData,
): Promise<AktarimSonuc> {
  const marka = await listeErisimi(formData);
  const user = await assertUser();

  const hazir = await aktarimiHazirla(marka, formData);
  if (!hazir) {
    return {
      durum: 'hata', mesaj: 'Yapıştırılan metinde satır bulunamadı.',
      metin: String(formData.get('metin') ?? ''),
    };
  }
  const { hucreler, eslesme, baslikVar, eklenecekler, ozet } = hazir;

  const adim = String(formData.get('adim') ?? 'onizle');
  if (adim !== 'kaydet') {
    return {
      durum: 'onizleme',
      metin: String(formData.get('metin') ?? ''),
      baslikVar, eslesme,
      basliklar: baslikVar ? (hucreler[0] ?? []) : (hucreler[0] ?? []).map((_, i) => `${i + 1}. sütun`),
      ornek: eklenecekler.slice(0, 12).map((e) => ({
        Durum: e.durumEtiket, Ad: e.ad, Telefon: e.hamTel ?? '—',
        Yetkili: e.yetkili ?? '', Şehir: e.sehir ?? '', Kaynak: e.kaynak ?? '', Not: e.not ?? '',
      })),
      ozet,
      kaynak: metin(formData, 'kaynak'),
      sorumlu: metin(formData, 'sorumlu'),
    };
  }

  // Aynı numara yapıştırmada iki kez varsa ilki alınır.
  const gorulen = new Set<string>();
  const sirali = eklenecekler.filter((e) => {
    if (!e.norm) return true;
    if (gorulen.has(e.norm)) return false;
    gorulen.add(e.norm);
    return true;
  });
  if (sirali.length === 0) {
    return {
      durum: 'hata',
      mesaj: 'Eklenecek satır yok — sütun eşleştirmesinde Ad / Firma ya da Telefon seçili mi?',
      metin: String(formData.get('metin') ?? ''),
    };
  }

  const parti = crypto.randomUUID();
  const sorumlu = sayi(formData, 'sorumlu');

  const eklenen = (await sql`
    INSERT INTO prospects
      (brand, name, contact_person, phone_raw, phone_norm, phone_kind, city, source, link,
       last_note, assigned_to, import_batch, created_by)
    SELECT ${marka.anahtar}, x.ad, x.yetkili, x.ham_tel, x.norm, x.tur, x.sehir, x.kaynak, x.link,
           x.notu, ${sorumlu}, ${parti}, ${user.id}
    FROM unnest(
      ${sirali.map((e) => e.ad)}::text[],
      ${sirali.map((e) => e.yetkili)}::text[],
      ${sirali.map((e) => e.hamTel)}::text[],
      ${sirali.map((e) => e.norm)}::text[],
      ${sirali.map((e) => e.tur)}::text[],
      ${sirali.map((e) => e.sehir)}::text[],
      ${sirali.map((e) => e.kaynak)}::text[],
      ${sirali.map((e) => e.link)}::text[],
      ${sirali.map((e) => e.not)}::text[]
    ) AS x(ad, yetkili, ham_tel, norm, tur, sehir, kaynak, link, notu)
    ON CONFLICT (brand, phone_norm) WHERE phone_norm IS NOT NULL DO NOTHING
    RETURNING id
  `) as Array<{ id: string }>;

  await logActivity({
    userId: user.id, action: 'ekle', entity: 'aday listesi',
    detail: `${marka.ad} — ${eklenen.length} aday içe aktarıldı`,
  });
  tazele(marka);
  return { durum: 'bitti', eklenen: eklenen.length, atlanan: sirali.length - eklenen.length, parti };
}

/**
 * Yanlış yapıştırmayı geri alır: yalnızca o partide eklenen ve HENÜZ
 * DOKUNULMAMIŞ kayıtlar silinir. Aranmış bir aday silinmez.
 */
export async function partiGeriAl(formData: FormData) {
  const marka = await listeErisimi(formData);
  const user = await assertUser();
  const parti = metin(formData, 'parti');
  if (!parti) return;

  const silinen = (await sql`
    DELETE FROM prospects p
    WHERE p.import_batch = ${parti} AND p.brand = ${marka.anahtar}
      AND p.call_count = 0
      AND NOT EXISTS (SELECT 1 FROM prospect_events e WHERE e.prospect_id = p.id)
    RETURNING id
  `) as Array<{ id: string }>;

  await logActivity({
    userId: user.id, action: 'sil', entity: 'aday listesi',
    detail: `${marka.ad} — içe aktarma geri alındı (${silinen.length} kayıt)`,
  });
  tazele(marka);
}
