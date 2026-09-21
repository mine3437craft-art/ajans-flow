'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { assertUser, assertAdmin, logActivity } from '@/lib/auth';
import {
  markaBul, digerMarka, DURUM_HARITA, gecerliDurum, gecerliUcDurum,
  sonrakiAramaTarihi, gunSonra, bugun, elleGecisTarihi, EK_ALANLAR,
  type Marka, type Durum, type UcDurum,
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
/**
 * YYYY-AA-GG, gerçekten var olan bir gün ve makul bir aralıkta mı (2020 —
 * bugünden 3 yıl sonrası). Tarih kutusuna elle yazarken tarayıcı ara
 * değerleri (0002-09-21, 0020-09-21…) de gönderiyor; bunlar kaydedilmesin.
 */
function tarihGecerli(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return false;
  const yil = Number(v.slice(0, 4));
  return yil >= 2020 && yil <= new Date().getUTCFullYear() + 3;
}

function sayi(fd: FormData, key: string): number | null {
  const v = metin(fd, key);
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isInteger(n) ? n : null;
}

/** Formdaki üç durumlu alan; geçersiz ya da hiç yoksa `varsayilan`. */
function ucDurumu(fd: FormData, key: string, varsayilan: UcDurum): UcDurum {
  const v = metin(fd, key);
  return gecerliUcDurum(v) ? v : varsayilan;
}

/** Geri alma için kaydın o anki özeti. Yeni alan eklenince tek yerden. */
function onceki(a: AdaySatir) {
  return {
    status: a.status, next_call_on: a.next_call_on, assigned_to: a.assigned_to,
    unreached_streak: a.unreached_streak, call_count: a.call_count,
    last_note: a.last_note, last_call_at: a.last_call_at, last_call_by: a.last_call_by,
    has_website: a.has_website, worked_with_agency: a.worked_with_agency,
    social_active: a.social_active,
  };
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
  has_website: UcDurum; worked_with_agency: UcDurum; social_active: UcDurum;
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
           call_count, last_note, last_call_at, last_call_by, has_website, worked_with_agency,
           social_active
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
         has_website, worked_with_agency, social_active, assigned_to, last_note, created_by)
      VALUES (${marka.anahtar}, ${ad}, ${bosNull(formData, 'contact_person')},
              ${hamTelefon}, ${tel.anahtar}, ${tel.tur},
              ${bosNull(formData, 'city')}, ${bosNull(formData, 'source')}, ${bosNull(formData, 'link')},
              ${ucDurumu(formData, 'has_website', 'bilinmiyor')},
              ${ucDurumu(formData, 'worked_with_agency', 'bilinmiyor')},
              ${ucDurumu(formData, 'social_active', 'bilinmiyor')},
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
        has_website = ${ucDurumu(formData, 'has_website', aday.has_website)},
        worked_with_agency = ${ucDurumu(formData, 'worked_with_agency', aday.worked_with_agency)},
        social_active = ${ucDurumu(formData, 'social_active', aday.social_active)},
        updated_at = NOW()
      WHERE id = ${aday.id}
    `;
  } catch (hata) {
    if (ciftKayitMi(hata)) return 'Bu numara listede başka bir kayıtta.';
    throw hata;
  }

  // Geçmişe iz: bu olay geri alınamaz (prev yok — ad/telefon anlık görüntüde
  // olmadığı için yarım geri alma olurdu), ama en son olay olduğu için daha
  // eski bir olayın "Geri al"ı bu düzenlemeyi sessizce ezemez.
  await sql`
    INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
    VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'durum', 'Bilgiler güncellendi')
  `;
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
  const prev = onceki(aday);

  if (alan === 'durum') {
    if (!gecerliDurum(deger)) throw new Error('Geçersiz durum.');
    // Kapalı durumda tarih temizlenir, "tekrar aranacak" bugün, diğer açık
    // durumlarda tarih yoksa varsayılanı — tarihsiz aday hiçbir kuyruğa girmiyordu.
    const tarih = elleGecisTarihi(deger, aday.next_call_on);
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
  } else if (alan === 'web' || alan === 'ajans' || alan === 'sosyal') {
    if (!gecerliUcDurum(deger)) throw new Error('Geçersiz değer.');
    if (!marka.ekAlanlar.includes(alan)) throw new Error('Bu alan bu listede kullanılmıyor.');
    const sutun = EK_ALANLAR[alan].sutun;
    if (sutun === 'has_website') {
      await sql`UPDATE prospects SET has_website = ${deger}, updated_at = NOW() WHERE id = ${aday.id}`;
    } else if (sutun === 'worked_with_agency') {
      await sql`UPDATE prospects SET worked_with_agency = ${deger}, updated_at = NOW() WHERE id = ${aday.id}`;
    } else {
      await sql`UPDATE prospects SET social_active = ${deger}, updated_at = NOW() WHERE id = ${aday.id}`;
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
  const sosyal = gecerliUcDurum(metin(formData, 'sosyal')) ? metin(formData, 'sosyal') : null;

  const prev = onceki(aday);

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
        social_active = COALESCE(${sosyal}, social_active),
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
      SELECT e.id, e.prospect_id, e.prev, e.kind
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
        -- Son not anlık görüntüden değil kalan olaylardan: arada düzenlenen
        -- ya da silinen not geri gelmesin. Olay kalmadıysa (Excel notu) eski değer.
        last_note = COALESCE((
          SELECT e2.note FROM prospect_events e2
          WHERE e2.prospect_id = p.id AND e2.id <> h.id AND e2.note IS NOT NULL
            AND e2.kind IN ('not', 'arama')
          ORDER BY e2.id DESC LIMIT 1
        ), CASE WHEN h.kind = 'arama' THEN h.prev->>'last_note' ELSE p.last_note END),
        last_call_at = NULLIF(h.prev->>'last_call_at', '')::timestamptz,
        last_call_by = NULLIF(h.prev->>'last_call_by', '')::int,
        has_website = COALESCE(h.prev->>'has_website', p.has_website),
        worked_with_agency = COALESCE(h.prev->>'worked_with_agency', p.worked_with_agency),
        social_active = COALESCE(h.prev->>'social_active', p.social_active),
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

  // Notu olan satırlar için not olayı: last_note her zaman olaylardan
  // türetiliyor, olaysız not ilk düzenlemede kaybolabilirdi.
  if (eklenen.length > 0) {
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
      SELECT p.id, p.brand, ${user.id}, 'not', p.last_note
      FROM prospects p
      WHERE p.id = ANY(${eklenen.map((e) => Number(e.id))}::bigint[]) AND p.last_note IS NOT NULL
    `;
  }

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

/* ================================================================ notlar
 * last_note her zaman "insan yazısı notu olan en son olay"ın notudur (not
 * ya da arama olayı). Mesaj şablonu adı ve alan değişikliği etiketleri
 * sistem notudur, ekibin yazdığı notu ezmez. Not düzenlenince ya da
 * silinince buradan yeniden hesaplanır — tablo ile geçmiş ayrışmaz.
 */
const INSAN_NOTU = ['not', 'arama'];

async function sonNotuYenile(adayId: number) {
  await sql`
    UPDATE prospects p SET
      last_note = (
        SELECT e.note FROM prospect_events e
        WHERE e.prospect_id = p.id AND e.note IS NOT NULL
          AND e.kind = ANY(${INSAN_NOTU}::text[])
        ORDER BY e.id DESC LIMIT 1
      ),
      updated_at = NOW()
    WHERE p.id = ${adayId}
  `;
}

/** Olayın notuna dokunma yetkisi: yazan kişi ya da yönetici. */
async function notOlayi(olayId: number | null, user: { id: number; role: string }) {
  if (olayId === null) throw new Error('Geçersiz not.');
  const rows = (await sql`
    SELECT e.id::int AS id, e.prospect_id::int AS prospect_id, e.kind, e.user_id, p.brand
    FROM prospect_events e JOIN prospects p ON p.id = e.prospect_id
    WHERE e.id = ${olayId}
  `) as Array<{ id: number; prospect_id: number; kind: string; user_id: number | null; brand: string }>;
  const o = rows[0];
  if (!o) throw new Error('Not bulunamadı.');
  if (user.role !== 'admin' && o.user_id !== user.id) {
    throw new Error('Başkasının notunu yalnızca yönetici düzenleyebilir.');
  }
  const marka = markaBul(o.brand);
  if (!marka) throw new Error('Liste tanınmıyor.');
  return { ...o, marka };
}

/**
 * Tablodaki "Son Not" hücresinden düzenleme. Notu taşıyan en son olay
 * güncellenir; hiç olay yoksa (Excel'den gelen not) yeni not olayı açılır.
 * Boş bırakılırsa not silinir.
 */
export async function sonNotDuzenle(formData: FormData) {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();
  const yeni = metin(formData, 'note').slice(0, 1000);

  const son = (await sql`
    SELECT id::int AS id, kind, user_id FROM prospect_events
    WHERE prospect_id = ${aday.id} AND note IS NOT NULL
      AND kind = ANY(${INSAN_NOTU}::text[])
    ORDER BY id DESC LIMIT 1
  `) as Array<{ id: number; kind: string; user_id: number | null }>;
  const olay = son[0];

  if (olay && user.role !== 'admin' && olay.user_id !== user.id) {
    // Başkasının notunu ezmek yerine üstüne yeni not ekle.
    if (yeni) {
      await sql`
        INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
        VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'not', ${yeni})
      `;
    }
  } else if (olay) {
    if (yeni) {
      await sql`
        UPDATE prospect_events SET note = ${yeni}, edited_at = NOW(), edited_by = ${user.id}
        WHERE id = ${olay.id}
      `;
    } else if (olay.kind === 'not') {
      await sql`DELETE FROM prospect_events WHERE id = ${olay.id}`;
    } else {
      await sql`UPDATE prospect_events SET note = NULL, edited_at = NOW(), edited_by = ${user.id} WHERE id = ${olay.id}`;
    }
  } else if (yeni) {
    await sql`
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'not', ${yeni})
    `;
  } else {
    await sql`UPDATE prospects SET last_note = NULL, updated_at = NOW() WHERE id = ${aday.id}`;
    tazele(marka);
    return;
  }

  await sonNotuYenile(aday.id);
  tazele(marka);
}

/** Geçmişteki belirli bir notu düzenler (boşsa siler). */
export async function notDuzenle(formData: FormData) {
  const user = await assertUser();
  const o = await notOlayi(sayi(formData, 'olay_id'), user);
  const yeni = metin(formData, 'note').slice(0, 1000);

  if (!yeni) {
    if (o.kind === 'not') await sql`DELETE FROM prospect_events WHERE id = ${o.id}`;
    else await sql`UPDATE prospect_events SET note = NULL, edited_at = NOW(), edited_by = ${user.id} WHERE id = ${o.id}`;
  } else {
    await sql`
      UPDATE prospect_events SET note = ${yeni}, edited_at = NOW(), edited_by = ${user.id}
      WHERE id = ${o.id}
    `;
  }
  await sonNotuYenile(o.prospect_id);
  tazele(o.marka);
}

export async function notSil(formData: FormData) {
  const user = await assertUser();
  const o = await notOlayi(sayi(formData, 'olay_id'), user);
  if (o.kind === 'not') await sql`DELETE FROM prospect_events WHERE id = ${o.id}`;
  else await sql`UPDATE prospect_events SET note = NULL, edited_at = NOW(), edited_by = ${user.id} WHERE id = ${o.id}`;
  await sonNotuYenile(o.prospect_id);
  tazele(o.marka);
}

/* ======================================================= tekrar aranacak */

/**
 * Tek dokunuş: adayı yeniden arama kuyruğuna alır (bugün). Olumsuz ya da
 * düşünüyor gibi bir durumdaki adayı "bir daha deneyelim" demek için.
 * Arama sayılmaz; geri alınabilir.
 */
export async function tekrarAranacak(formData: FormData) {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();
  const tarih = bugun();
  await sql`
    WITH olay AS (
      INSERT INTO prospect_events (prospect_id, brand, user_id, kind, status_before, status_after, next_call_on, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'durum', ${aday.status}, 'tekrar_aranacak',
              ${tarih}, ${JSON.stringify(onceki(aday))}::jsonb)
      RETURNING id
    )
    UPDATE prospects SET status = 'tekrar_aranacak', next_call_on = ${tarih}, updated_at = NOW()
    WHERE id = ${aday.id}
  `;
  tazele(marka);
}

/* ========================================================== toplu işlem */

const TOPLU_SINIR = 500;

function kimlikler(fd: FormData): number[] {
  return metin(fd, 'idler').split(',')
    .map((x) => parseInt(x, 10))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, TOPLU_SINIR);
}

/**
 * Seçilen adaylara tek işlemde durum / sorumlu / tarih uygular. Tek SQL
 * ifadesi: her aday için geçmişe olay (geri alma anlık görüntüsüyle)
 * yazılır ve kayıt güncellenir. Kimlikler yalnızca bu listeye aitse
 * işlenir — başka listeden kimlik gönderilirse sessizce atlanır.
 */
export async function topluGuncelle(formData: FormData) {
  const marka = await listeErisimi(formData);
  const user = await assertUser();
  const idler = kimlikler(formData);
  if (idler.length === 0) return;

  const alan = metin(formData, 'alan');
  const deger = metin(formData, 'deger');

  let durum: string | null = null;
  let acik = true;
  let tekrar = false;
  let sorumlu: number | null = null;
  let sorumluVar = false;
  let tarih: string | null = null;
  let tarihVar = false;

  let varsayilanTarih: string | null = null;
  if (alan === 'durum') {
    if (!gecerliDurum(deger)) throw new Error('Geçersiz durum.');
    durum = deger;
    acik = DURUM_HARITA[deger].acik;
    tekrar = deger === 'tekrar_aranacak';
    // Mevcut tarihi olmayan satırlar için (elleGecisTarihi ile aynı kural)
    varsayilanTarih = elleGecisTarihi(deger, null);
  } else if (alan === 'sorumlu') {
    sorumluVar = true;
    sorumlu = deger === '' ? null : parseInt(deger, 10);
    if (sorumlu !== null) {
      const ok = (await sql`SELECT 1 FROM users WHERE id = ${sorumlu} AND is_active`) as unknown[];
      if (ok.length === 0) throw new Error('Kullanıcı bulunamadı.');
    }
  } else if (alan === 'tarih') {
    tarihVar = true;
    tarih = tarihGecerli(deger) ? deger : null;
  } else {
    throw new Error('Geçersiz toplu işlem.');
  }

  const b = bugun();
  const sonuc = (await sql`
    WITH hedef AS (
      SELECT id, status, next_call_on, assigned_to, unreached_streak, call_count,
             last_note, last_call_at, last_call_by, has_website, worked_with_agency, social_active
      FROM prospects
      WHERE id = ANY(${idler}::bigint[]) AND brand = ${marka.anahtar}
    ),
    yeni AS (
      SELECT h.*,
             COALESCE(${durum}::text, h.status) AS y_status,
             CASE
               WHEN ${tarihVar}::boolean THEN ${tarih}::date
               WHEN ${durum}::text IS NULL THEN h.next_call_on
               WHEN NOT ${acik}::boolean THEN NULL
               WHEN ${tekrar}::boolean THEN ${b}::date
               ELSE COALESCE(h.next_call_on, ${varsayilanTarih}::date)
             END AS y_tarih,
             CASE WHEN ${sorumluVar}::boolean THEN ${sorumlu}::int ELSE h.assigned_to END AS y_sorumlu
      FROM hedef h
    ),
    olay AS (
      INSERT INTO prospect_events
        (prospect_id, brand, user_id, kind, status_before, status_after, next_call_on, prev)
      SELECT y.id, ${marka.anahtar}, ${user.id}, 'durum', y.status, y.y_status, y.y_tarih,
             jsonb_build_object(
               'status', y.status, 'next_call_on', y.next_call_on, 'assigned_to', y.assigned_to,
               'unreached_streak', y.unreached_streak, 'call_count', y.call_count,
               'last_note', y.last_note, 'last_call_at', y.last_call_at, 'last_call_by', y.last_call_by,
               'has_website', y.has_website, 'worked_with_agency', y.worked_with_agency,
               'social_active', y.social_active)
      FROM yeni y
      RETURNING id
    ),
    guncel AS (
      UPDATE prospects p SET
        status = y.y_status, next_call_on = y.y_tarih, assigned_to = y.y_sorumlu, updated_at = NOW()
      FROM yeni y WHERE p.id = y.id
      RETURNING p.id
    )
    SELECT COUNT(*)::int AS n FROM guncel
  `) as Array<{ n: number }>;

  await logActivity({
    userId: user.id, action: 'güncelle', entity: 'aday (toplu)',
    detail: `${marka.ad} — ${sonuc[0]?.n ?? 0} aday: ${alan} → ${
      alan === 'durum' ? DURUM_HARITA[deger]?.ad : deger || '—'}`,
  });
  tazele(marka);
}

/** Toplu kalıcı silme: yalnızca yönetici. */
export async function topluSil(formData: FormData) {
  const admin = await assertAdmin();
  const marka = await listeErisimi(formData);
  const idler = kimlikler(formData);
  if (idler.length === 0) return;
  const silinen = (await sql`
    DELETE FROM prospects WHERE id = ANY(${idler}::bigint[]) AND brand = ${marka.anahtar}
    RETURNING id
  `) as unknown[];
  await logActivity({
    userId: admin.id, action: 'sil', entity: 'aday (toplu)',
    detail: `${marka.ad} — ${silinen.length} aday silindi`,
  });
  tazele(marka);
}

/* ============================================================ WhatsApp */

/** Mesaj gönderilince durumu ilerletilebilecek (henüz konuşulmamış) durumlar. */
const MESAJLA_ILERLER: Durum[] = ['aranmadi', 'tekrar_aranacak', 'ulasilamadi'];

/**
 * WhatsApp şablonuyla mesaj açıldığında çağrılır. Mesajı WhatsApp gönderir
 * — biz yalnızca kaydını tutuyoruz: geçmişe "mesaj" olayı, şablon bir durum
 * belirtiyorsa ve aday henüz konuşulmamışsa durum ilerler (düşünüyor /
 * olumlu gibi ileri bir durumu geri çekmez), sahipsiz aday gönderene geçer.
 */
export async function mesajKaydet(formData: FormData) {
  const id = sayi(formData, 'id');
  const { marka, aday } = await adayErisimi(id);
  const user = await assertUser();

  const sablonId = sayi(formData, 'sablon_id');
  let baslik = 'WhatsApp mesajı';
  let hedefDurum: Durum | null = null;
  if (sablonId !== null) {
    const rows = (await sql`
      SELECT title, sets_status FROM prospect_templates
      WHERE id = ${sablonId} AND brand = ${marka.anahtar}
    `) as Array<{ title: string; sets_status: string | null }>;
    if (rows[0]) {
      baslik = rows[0].title;
      hedefDurum = gecerliDurum(rows[0].sets_status) ? rows[0].sets_status : null;
    }
  }

  const ilerlesin = hedefDurum !== null && MESAJLA_ILERLER.includes(aday.status);
  const yeniDurum = ilerlesin ? hedefDurum! : aday.status;
  // Durum ilerlemese de (hatırlatma, boş mesaj) açık adayda cevabı beklemek
  // için tarih 2 gün ileri kayar; yoksa mesaj atılan aday "gecikti"de kalıyordu.
  const yeniTarih = ilerlesin ? sonrakiAramaTarihi(yeniDurum, 0)
    : DURUM_HARITA[aday.status]?.acik ? gunSonra(2)
    : aday.next_call_on;

  await sql`
    WITH olay AS (
      INSERT INTO prospect_events
        (prospect_id, brand, user_id, kind, channel, status_before, status_after, next_call_on, note, prev)
      VALUES (${aday.id}, ${marka.anahtar}, ${user.id}, 'mesaj', 'whatsapp',
              ${aday.status}, ${yeniDurum}, ${yeniTarih}, ${`💬 ${baslik}`},
              ${JSON.stringify(onceki(aday))}::jsonb)
      RETURNING id
    )
    UPDATE prospects SET
      status = ${yeniDurum}, next_call_on = ${yeniTarih},
      assigned_to = COALESCE(assigned_to, ${user.id}), updated_at = NOW()
    WHERE id = ${aday.id}
  `;
  tazele(marka);
}

/* ============================================================ şablonlar */

const SABLON_DURUMLARI = ['detay_iletildi', 'tekrar_aranacak', 'dusunuyor'];

export async function sablonKaydet(_prev: string | null, formData: FormData): Promise<string | null> {
  const marka = await listeErisimi(formData);
  const user = await assertUser();
  const baslik = metin(formData, 'title').slice(0, 60);
  const govde = metin(formData, 'body').slice(0, 2000);
  if (!baslik) return 'Şablona bir ad ver (ör. Tanışma).';
  if (!govde) return 'Mesaj metni boş olamaz.';
  const durum = metin(formData, 'sets_status');
  const setsStatus = SABLON_DURUMLARI.includes(durum) ? durum : null;
  const id = sayi(formData, 'id');

  if (id !== null) {
    const r = (await sql`
      UPDATE prospect_templates SET title = ${baslik}, body = ${govde},
             sets_status = ${setsStatus}, updated_at = NOW()
      WHERE id = ${id} AND brand = ${marka.anahtar}
      RETURNING id
    `) as unknown[];
    if (r.length === 0) return 'Şablon bulunamadı.';
  } else {
    await sql`
      INSERT INTO prospect_templates (brand, title, body, sets_status, sort_order, created_by)
      VALUES (${marka.anahtar}, ${baslik}, ${govde}, ${setsStatus},
              (SELECT COALESCE(MAX(sort_order), 0) + 10 FROM prospect_templates WHERE brand = ${marka.anahtar}),
              ${user.id})
    `;
  }
  await logActivity({
    userId: user.id, action: id !== null ? 'güncelle' : 'ekle', entity: 'mesaj şablonu',
    detail: `${marka.ad} — ${baslik}`,
  });
  revalidatePath(`/musteri-bulma/${marka.yol}`);
  revalidatePath(`/musteri-bulma/${marka.yol}/sablonlar`);
  return `ok|${Date.now()}|`;
}

export async function sablonSil(formData: FormData) {
  const marka = await listeErisimi(formData);
  const user = await assertUser();
  const id = sayi(formData, 'id');
  if (id === null) return;
  // Yönetici ya da şablonu yazan kişi silebilir.
  await sql`
    DELETE FROM prospect_templates
    WHERE id = ${id} AND brand = ${marka.anahtar}
      AND (${user.role === 'admin'}::boolean OR created_by = ${user.id})
  `;
  revalidatePath(`/musteri-bulma/${marka.yol}`);
  revalidatePath(`/musteri-bulma/${marka.yol}/sablonlar`);
}
