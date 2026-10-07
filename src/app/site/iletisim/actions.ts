'use server';

import { headers } from 'next/headers';
import { sql } from '@/lib/db';
import { telefonCoz } from '@/lib/telefon';
import { bugun, gecerliSektor, SEKTOR_HARITA, saklanirEksik, EKSIK_HARITA } from '@/lib/adaylar';

/**
 * Kurumsal sitedeki iletişim formu. Gelen talep doğrudan panelin
 * "Ajans Flow — Müşteri Bulma" listesine aday olarak düşer; kaynak
 * "Web sitesi" ve arama tarihi BUGÜN olduğu için ekip aynı gün görür.
 *
 * Form herkese açık: kimlik doğrulaması yok. Bu yüzden
 *   - bal küpü (honeypot) alanı,
 *   - en az 3 saniye doldurma süresi,
 *   - IP başına saatlik sınır,
 *   - alan uzunluk sınırları
 * birlikte kullanılıyor. Kişisel veri olarak IP SAKLANMIYOR; yalnızca
 * sunucu belleğinde sayaç tutuluyor.
 */

export type TalepSonucu =
  | { durum: 'ok'; mesaj: string }
  | { durum: 'hata'; mesaj: string; alan?: string };

const SINIR_ADET = 5;
const SINIR_SURE = 60 * 60 * 1000; // 1 saat
const sayaclar = new Map<string, number[]>();

function sinirAsildi(anahtar: string): boolean {
  const simdi = Date.now();
  const onceki = (sayaclar.get(anahtar) ?? []).filter((t) => simdi - t < SINIR_SURE);
  onceki.push(simdi);
  sayaclar.set(anahtar, onceki);
  // Bellek şişmesin: eski anahtarları ara sıra temizle.
  if (sayaclar.size > 500) {
    for (const [k, v] of sayaclar) {
      if (v.every((t) => simdi - t >= SINIR_SURE)) sayaclar.delete(k);
    }
  }
  return onceki.length > SINIR_ADET;
}

function metin(fd: FormData, ad: string, enCok: number): string {
  return String(fd.get(ad) ?? '').trim().slice(0, enCok);
}

/** Basit e-posta kontrolü: boş geçilebilir, yazıldıysa makul görünmeli. */
function epostaGecerli(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
}

export async function talepGonder(_onceki: TalepSonucu | null, fd: FormData): Promise<TalepSonucu> {
  // 1) Bal küpü: gerçek kullanıcı bu alanı göremez, bot doldurur.
  if (metin(fd, 'web_adresi', 100) !== '') {
    return { durum: 'ok', mesaj: 'Talebiniz alındı.' };
  }

  // 2) Formun açılışıyla gönderim arası çok kısaysa otomatik gönderimdir.
  const acilis = Number(metin(fd, 'acilis', 20));
  if (Number.isFinite(acilis) && acilis > 0 && Date.now() - acilis < 3000) {
    return { durum: 'hata', mesaj: 'Form çok hızlı gönderildi, lütfen tekrar deneyin.' };
  }

  // 3) KVKK onayı zorunlu.
  if (metin(fd, 'kvkk', 10) !== 'evet') {
    return { durum: 'hata', mesaj: 'Devam etmek için aydınlatma metnini onaylamanız gerekiyor.', alan: 'kvkk' };
  }

  const ad = metin(fd, 'ad', 120);
  if (ad.length < 2) return { durum: 'hata', mesaj: 'Adınızı yazar mısınız?', alan: 'ad' };

  const hamTelefon = metin(fd, 'telefon', 40);
  const tel = telefonCoz(hamTelefon);
  if (!tel.gecerli) {
    return { durum: 'hata', mesaj: 'Telefon numarasını kontrol eder misiniz? (örn. 0532 123 45 67)', alan: 'telefon' };
  }

  const eposta = metin(fd, 'eposta', 160);
  if (eposta && !epostaGecerli(eposta)) {
    return { durum: 'hata', mesaj: 'E-posta adresi geçersiz görünüyor.', alan: 'eposta' };
  }

  const isletme = metin(fd, 'isletme', 150);
  const mesaj = metin(fd, 'mesaj', 1500);
  const sektorHam = metin(fd, 'sektor', 40);
  const sektor = gecerliSektor(sektorHam) ? sektorHam : null;
  // İlgilenilen hizmetler: formda birden çok kutu işaretlenebilir.
  const hizmetler = fd.getAll('hizmet').map((h) => String(h).slice(0, 60)).filter(Boolean).slice(0, 12);

  // Akış Kartı: sitede işaretlenen eksikler panele aynen düşer. "Web sitesi yok"
  // dizide tutulmaz, has_website alanına yazılır (bkz. src/lib/adaylar.ts EKSIKLER).
  const eksikHam = fd.getAll('eksik').map((e) => String(e));
  const eksikler = [...new Set(eksikHam.filter(saklanirEksik))].slice(0, 20);
  const webYok = eksikHam.includes('web_yok');
  const eksikAdlari = [...(webYok ? ['Web sitesi yok'] : []), ...eksikler.map((k) => EKSIK_HARITA[k].ad)];

  // 4) IP başına saatlik sınır (IP saklanmıyor, yalnızca sayaç anahtarı).
  const basliklar = await headers();
  const ip = (basliklar.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'bilinmiyor';
  if (sinirAsildi(ip)) {
    return { durum: 'hata', mesaj: 'Çok fazla deneme yapıldı. Bir süre sonra tekrar deneyin ya da WhatsApp’tan yazın.' };
  }

  const not = [
    mesaj,
    eksikAdlari.length ? `Sitede işaretlediği eksikler: ${eksikAdlari.join(', ')}` : '',
    hizmetler.length ? `İlgilendiği hizmetler: ${hizmetler.join(', ')}` : '',
    sektor ? `Sektör: ${SEKTOR_HARITA[sektor].ad}` : '',
    eposta ? `E-posta: ${eposta}` : '',
  ].filter(Boolean).join(' · ') || 'Web sitesinden iletişim talebi';

  const adayAdi = isletme || ad;

  try {
    // Aynı numara zaten listedeyse yeni kayıt açılmaz: mevcut adaya not
    // düşülür ve bugün aranacaklara alınır.
    const mevcut = tel.anahtar
      ? ((await sql`
          SELECT id::int AS id FROM prospects
          WHERE brand = 'ajansflow' AND phone_norm = ${tel.anahtar} LIMIT 1
        `) as Array<{ id: number }>)
      : [];

    if (mevcut[0]) {
      const id = mevcut[0].id;
      await sql`
        WITH olay AS (
          INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
          VALUES (${id}, 'ajansflow', NULL, 'not', ${`🌐 Web sitesinden tekrar yazdı — ${not}`})
          RETURNING id
        )
        UPDATE prospects SET
          last_note = ${`🌐 Web sitesinden: ${not}`},
          next_call_on = ${bugun()}::date,
          contact_person = COALESCE(contact_person, ${ad}),
          email = COALESCE(email, ${eposta || null}),
          sector = COALESCE(sector, ${sektor}),
          has_website = CASE WHEN ${webYok}::boolean THEN 'yok' ELSE has_website END,
          -- Kendi işaretlediği eksikler mevcutlara eklenir, hiçbiri silinmez.
          gaps = ARRAY(
            SELECT g FROM unnest(gaps || ${eksikler}::text[]) WITH ORDINALITY AS t(g, sira)
            WHERE g IS NOT NULL GROUP BY g ORDER BY min(sira)
          ),
          updated_at = NOW()
        WHERE id = ${id}
      `;
      return { durum: 'ok', mesaj: 'Talebiniz bize ulaştı, en kısa sürede döneceğiz.' };
    }

    const eklenen = (await sql`
      INSERT INTO prospects
        (brand, name, contact_person, phone_raw, phone_norm, phone_kind, email, sector,
         source, status, next_call_on, last_note, gaps, has_website)
      VALUES ('ajansflow', ${adayAdi}, ${ad}, ${hamTelefon}, ${tel.anahtar}, ${tel.tur},
              ${eposta || null}, ${sektor}, 'Web sitesi', 'aranmadi', ${bugun()}::date,
              ${`🌐 Web sitesinden: ${not}`}, ${eksikler}::text[],
              ${webYok ? 'yok' : 'bilinmiyor'})
      ON CONFLICT (brand, phone_norm) WHERE phone_norm IS NOT NULL DO NOTHING
      RETURNING id::int AS id
    `) as Array<{ id: number }>;

    if (eklenen[0]) {
      await sql`
        INSERT INTO prospect_events (prospect_id, brand, user_id, kind, note)
        VALUES (${eklenen[0].id}, 'ajansflow', NULL, 'not', ${`🌐 Web sitesinden gelen talep — ${not}`})
      `;
    }
    return { durum: 'ok', mesaj: 'Talebiniz bize ulaştı, en kısa sürede döneceğiz.' };
  } catch (hata) {
    console.error('[site] iletişim formu kaydedilemedi', hata);
    return {
      durum: 'hata',
      mesaj: 'Şu an kaydedemedik. WhatsApp ya da Instagram’dan yazarsanız hemen dönebiliriz.',
    };
  }
}
